// making swagger configurations
export const SwaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Feedback Management Swagger UI",
            version: "0.1.0",
            description: "Feedback Management API ",
        },
        servers: [
            {
                url: "https://feedbackbackend-dev.azurewebsites.net",
            },
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/*.ts", "./src/documentation/*.yaml"],
};
