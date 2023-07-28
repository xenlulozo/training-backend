import { Client } from "@elastic/elasticsearch";

export const client = new Client({
    cloud: {
        id: '4ea1570f45434941bce9b719f7f7a9a9:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGVmYmJhNWQ4MDBmZDQxZGVhMDRjMTNmOTgwYjUzYzJkJDI4NmIzYzg5N2U0MDRkMTY5ZjI0OGIwMmMwYzRmODAy',
    },
    auth: {
        username: '<elastic>',
        password: '<MJQRd33BBH6ZG9YZeVcJXOtr>'
    }
})


