import { createClient } from "contentful";

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID || 'your_space_id',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'your_access_token',
});

export default client;