
import { Server, Socket } from 'socket.io';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OnModuleInit } from '@nestjs/common';
import { SocketDb } from './socket.entity';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { Conversation } from '../conversation/entities/conversation.entity';
import { Client } from '@elastic/elasticsearch';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Message } from '../message/entities/message.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { JwtService } from '@nestjs/jwt';
import { async } from 'rxjs';

@WebSocketGateway()
export class MyGateway implements OnModuleInit {

    constructor(
        private readonly elSearchService: ElasticsearchService,

        @InjectRedis() private readonly redis: Redis,
        @InjectRepository(SocketDb)
        private socketRepository: Repository<SocketDb>,
        @InjectRepository(Conversation)
        private converRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        private jwtService: JwtService

    ) { }
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        // this.server.on('connect', (socket) => {
        //     console.log(socket.id + " connected")
        // })
    }

    @SubscribeMessage('join')
    async onJoin(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
        const conversationId = client.handshake.query.conversation_id;
        const user_id = client.handshake.query.user_id;

        // save member in conversation
        await this.redis.set(`member_conversation_${client.handshake.query.conversation_id.toString()}`, JSON.stringify((await this.converRepository.findOne({ where: { conversation_id: Number(conversationId) } })).member))

        try {
            const socket = await this.socketRepository.findOne({ where: { user_id: client.handshake.query.user_id.toString() } })
            // if (socket) {
            socket.socket = client.id
            socket.rooms = conversationId.toString()
            await this.socketRepository.save(socket)
            //save table socket
            await this.redis.set(client.handshake.query.user_id.toString(), JSON.stringify(socket))
            log(socket)
            //save conversation_id
            await this.redis.set(client.handshake.query.conversation_id.toString(), client.handshake.query.conversation_id.toString())

            // } else {
            //     const newClient = new SocketDb()
            //     newClient.socket = client.id;
            //     newClient.user_id = client.handshake.query.user_id.toString();
            //     newClient.rooms = conversationId.toString()

            //     await this.socketRepository.save(newClient)
            //     //save table socket

            //     await this.redis.set(client.handshake.query.user_id.toString(), JSON.stringify(socket))
            //     //save conversation_id

            //     await this.redis.set(client.handshake.query.conversation_id.toString(), client.handshake.query.conversation_id.toString())
            // }

        } catch (error) {
            console.log(error)
        }
        client.join(conversationId);
    }
    async handleConnection(client: Socket) {
        console.log(`Client ${client.id} connected.`);

        try {

            const token = await client.handshake.query.token
            if (!token)
                return
            const access_token = await this.jwtService.decode(token.toString());
            // console.log(access_token)
            if (!access_token)
                return

            //save user_id
            const newClient = new SocketDb()
            newClient.socket = client.id;
            newClient.user_id = client.handshake.query.user_id.toString();
            newClient.rooms = "0";

            await this.socketRepository.save(newClient)
            await this.redis.set(`user_id_${client.handshake.query.user_id.toString()}`, access_token?.sub)
            // log(await this.redis.get("user_id"))

        } catch (error) {
            return
        }

        this.broadcastStatus();
    }
    async handleDisconnect(client: Socket) {

        try {
            const findClient = await this.socketRepository.findOne({ where: { socket: client.id } })
            await this.socketRepository.remove(findClient)
            await this.redis.del(client.handshake.query.user_id.toString())
        } catch (error) {
            client.id
            console.log(error)
        }
    }

    @SubscribeMessage('onGroup')
    handleChatEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
        console.log(client.rooms)
        this.server.emit('onGroup', {
            mmg: "msg",
            data: data
        });
    }
    private broadcastStatus(): void {
        // this.server.emit('onlineStatus', Array.from(this.roomCount));
    }
    isClientInRoom(clientId: string, roomId: string): boolean {
        const roomSockets = this.server.sockets.adapter.rooms.get(roomId);
        return roomSockets?.has(clientId) || false;
    }
    @SubscribeMessage('events')
    async handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: string): Promise<string> {

        const userExistsInMemberArray = await this.converRepository
            .createQueryBuilder('conversation')
            .where(':userId = ANY(conversation.member)', { userId: client.handshake.query.user_id.toString() })
            .getCount();

        log("sos", userExistsInMemberArray)
        if (!userExistsInMemberArray)
            return `user not exist in conversation`
        if (!await this.redis.get(client.handshake.query.user_id.toString()))
            return `huh`
        try {
            const userId = await this.redis.get(`user_id_${client.handshake.query.user_id.toString()}`)
            log(userId)
            const rooms = await this.redis.get(client.handshake.query.conversation_id.toString())
            log(rooms)
            const socketId = JSON.parse(await this.redis.get(client.handshake.query.user_id.toString())).socket
            log(socketId)
            let memberInConver = JSON.parse(await this.redis.get(`member_conversation_${client.handshake.query.conversation_id.toString()}`))
            log(memberInConver)

            if (!memberInConver)
                memberInConver = (await this.converRepository.findOne({ where: { conversation_id: Number(client.handshake.query.conversation_id) } })).member
            const checkMember = await this.socketRepository.find({ where: { user_id: In(memberInConver), rooms: Not(client.handshake.query.conversation_id.toString()) } })
            //emit rooms
            console.log(checkMember)
            this.server.to(rooms).emit('events', data);
            const mes = new Message();
            mes.conversation_id = Number(client.handshake.query.conversation_id)
            mes.user_id = Number(client.handshake.query.user_id)
            mes.message = data

            await this.messageRepository.save(mes)
            await this.elSearchService.index({
                index: 'message',
                document: { ...mes },
            })
            //inside

            checkMember && checkMember.map(async (item) => {
                log("go", item.socket)
                const mes = new Message();
                mes.conversation_id = Number(client.handshake.query.conversation_id)
                mes.user_id = Number(item.user_id)
                mes.message = data

                await this.messageRepository.save(mes)
                await this.elSearchService.index({
                    index: 'message',
                    document: { ...mes },
                })
                this.server.to(item.socket).emit('events', data);
                // }
            })

            /////
            // if (conver?.member.includes(Number(tmp?.to))) {
            //     log("in room")
            //     if (this.isClientInRoom(cl.socket, client.handshake.query.conversation_id.toString())) {

            //         const mes = new Message();
            //         mes.conversation_id = Number(client.handshake.query.conversation_id)
            //         mes.user_id = Number(client.handshake.query.user_id)
            //         mes.message = tmp?.message

            //         await this.messageRepository.save(mes)
            //         await this.elSearchService.index({
            //             index: 'message',
            //             document: { ...mes },
            //         })

            //         log(client?.handshake?.query?.conversation_id, client.handshake?.query?.user_id, tmp?.message)
            //         this.server.to(rooms).emit('events', { content: JSON.parse(data) });
            //     }
            //     else {
            //         log("not in room")

            //         if (!cl)
            //             return `user not found`
            //         if (cl.socket) {

            //             log(client?.handshake?.query?.conversation_id, client.handshake?.query?.user_id, tmp?.message)

            //             const mes = new Message();
            //             mes.conversation_id = Number(client.handshake.query.conversation_id)
            //             mes.user_id = Number(client.handshake.query.user_id)
            //             mes.message = tmp?.message

            //             await this.messageRepository.save(mes)
            //             await this.elSearchService.index({
            //                 index: 'message',
            //                 document: { ...mes },
            //             })
            //             this.server.to(cl.socket).emit('events', { "from client": { content: JSON.parse(data) } });
            //         }
            //     }
            // }
            // else
            //     console.log("Client is not a member of the conversation.");



            // const tmp = JSON.parse(data)
            // // const cl = await this.socketRepository.findOne({ where: { user_id: tmp.to.toString() } })
            // const cl = JSON.parse(await this.redis.get(tmp.to.toString()));
            // 
            // if (conver?.member.includes(Number(tmp?.to))) {
            //     log("in room")
            //     if (this.isClientInRoom(cl.socket, client.handshake.query.conversation_id.toString())) {

            //         const mes = new Message();
            //         mes.conversation_id = Number(client.handshake.query.conversation_id)
            //         mes.user_id = Number(client.handshake.query.user_id)
            //         mes.message = tmp?.message

            //         await this.messageRepository.save(mes)
            //         await this.elSearchService.index({
            //             index: 'message',
            //             document: { ...mes },
            //         })

            //         log(client?.handshake?.query?.conversation_id, client.handshake?.query?.user_id, tmp?.message)
            //         this.server.to(rooms).emit('events', { content: JSON.parse(data) });
            //     }
            //     else {
            //         log("not in room")

            //         if (!cl)
            //             return `user not found`
            //         if (cl.socket) {

            //             log(client?.handshake?.query?.conversation_id, client.handshake?.query?.user_id, tmp?.message)

            //             const mes = new Message();
            //             mes.conversation_id = Number(client.handshake.query.conversation_id)
            //             mes.user_id = Number(client.handshake.query.user_id)
            //             mes.message = tmp?.message

            //             await this.messageRepository.save(mes)
            //             await this.elSearchService.index({
            //                 index: 'message',
            //                 document: { ...mes },
            //             })
            //             this.server.to(cl.socket).emit('events', { "from client": { content: JSON.parse(data) } });
            //         }
            //     }
            // }
            // else
            //     console.log("Client is not a member of the conversation.");

        } catch (error) {
            log("catch err")
        }

        return data;
    }



    //////////////////////////////////////////////////////////////////////////////////////////
    // private readonly roomCount: Map<string, number> = new Map<string, number>();
    // constructor(
    //     @InjectRepository(SocketDb)
    //     private socketRepository: Repository<SocketDb>,
    // ) { }
    // @WebSocketServer()
    // server: Server;

    // onModuleInit() {
    //     // this.server.on('connect', (socket) => {
    //     //     console.log(socket.id + " connected")
    //     // })
    // }

    // private connectedClients: Set<string> = new Set<string>();

    // handleConnection(client: Socket) {
    //     console.log(`Client ${client.id} connected.`);
    //     const conversationId = client.handshake.query.conversation_id;

    //     client.join(conversationId);
    //     console.log(client.rooms)

    //     this.updateRoomCount(conversationId.toString());

    //     console.log(`Client ${client.id} joined room: ${conversationId}`);
    //     console.log(`Room counts after join:`, this.roomCount);

    //     this.broadcastStatus();
    // }
    // private updateRoomCount(room: string) {
    //     const roomSize = this.server.sockets.adapter.rooms.get(room)?.size || 0;
    //     // console.log(roomSize)

    //     this.roomCount.set(room, roomSize);
    // }
    // handleDisconnect(client: Socket) {
    //     console.log(`Client ${client.id} disconnected.`);
    //     console.log(`Client ${client.id} disconnected. Current rooms:`, client.rooms);
    //     console.log(client.rooms)

    //     const rooms = Array.from(client.rooms);

    //     rooms.forEach((room) => {
    //         client.leave(room);
    //         this.updateRoomCount(room);
    //     });

    //     this.broadcastStatus();
    // }

    // @SubscribeMessage('onGroup')
    // handleChatEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {

    //     // client.join(client.handshake.query.conversation_id);
    //     console.log(client.rooms)
    //     this.server.emit('onGroup', {
    //         mmg: "msg",
    //         data: data
    //     });
    // }
    // private broadcastStatus(): void {
    //     this.server.emit('onlineStatus', Array.from(this.roomCount));
    // }



}