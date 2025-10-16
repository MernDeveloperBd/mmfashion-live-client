const stripe_sky = 'pk_test_51Rl7FN6uWmc1ye7HzEdg0gw0h5dJJHTxIkfMqNpknJP0Q7XJMEdhoj8wF2X5jF7erH7pJXmF72PXWAaO6tFhfLmq006IxS4qMO'


const production = 'production'
const dev = 'development'

const mode = production

let app_url, api_url

if (mode === production) {
    app_url = "https://shopmy-cyan.vercel.app"
    api_url = "https://api-ecommerce-fos4.onrender.com"
} else {
    app_url = 'http://localhost:5173'
    api_url = 'http://localhost:5000'
}

export {
    app_url,
    api_url,
    stripe_sky
}