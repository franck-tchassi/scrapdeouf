// src/lib/plans.ts
export const plans = [
    {
        link: process.env.NODE_ENV === 'production'? 'https://buy.stripe.com/7sY5kC91I5kk8NU8Dnc3m00' : 'https://buy.stripe.com/test_bJe9AS1zg0006FMdXHc3m09',
        priceId: process.env.NODE_ENV === 'production'? 'price_1SPuzMAkgFpt9TxPsK9g7gbQ' : 'price_1SPuYuAkgFpt9TxPBzcZZLPs',
        price: 35,
        name: 'Pro Plan',
        duration: '/month',
    },
    {
        link: process.env.NODE_ENV === 'production'? 'https://buy.stripe.com/test_5kQeVcb9Q7ss5BI7zjc3m0a' : 'https://buy.stripe.com/cNicN4fq61449RYdXHc3m01',
        priceId: process.env.NODE_ENV === 'production'? 'price_1SPv28AkgFpt9TxPw0Vac27F' : 'price_1SPub2AkgFpt9TxPTd41uvzM',
        price: 294,
        name: 'Pro Plan',
        duration: '/year',
    },
    {
        link: process.env.NODE_ENV === 'production'? 'https://buy.stripe.com/test_cNi4gy7XE9AA3tAf1Lc3m0b' : 'https://buy.stripe.com/eVq9AS91IbII9RY9Hrc3m02',
        priceId: process.env.NODE_ENV === 'production'? 'price_1SPv4LAkgFpt9TxPgS9etmIe' : 'price_1SPucTAkgFpt9TxPOvpxUmJl',
        price: 59,
        name: 'Premium Plan',
        duration: '/month',
    },
    {
        link: process.env.NODE_ENV === 'production'? 'https://buy.stripe.com/test_bJe00i6TA9AA2pw1aVc3m0c' : 'https://buy.stripe.com/aFacN4gua9AA8NUf1Lc3m03',
        priceId: process.env.NODE_ENV === 'production'? 'price_1SPv5KAkgFpt9TxPblXTZdfY' : 'price_1SPuczAkgFpt9TxPLCYndrYk',
        price: 504,
        name: 'Premium Plan',
        duration: '/year',  
    },
    {
        link: process.env.NODE_ENV === 'production'? 'https://buy.stripe.com/test_fZuaEW1zg0000ho5rbc3m0d' : 'https://buy.stripe.com/eVqfZggua4gg7JQ1aVc3m04',
        priceId: process.env.NODE_ENV === 'production'? 'price_1SPv6fAkgFpt9TxPOaDeZU91' : 'price_1SPueCAkgFpt9TxP7e3Q8Owo',
        price: 299,
        name: 'Enterprise Plan',
        duration: '/month',
    },
    {
        link: process.env.NODE_ENV === 'production'? 'https://buy.stripe.com/test_5kQ6oG1zgdQQd4a9Hrc3m0e' : 'https://buy.stripe.com/dRm9ASem2144fci7zjc3m05',
        priceId: process.env.NODE_ENV === 'production'? 'price_1SPv7UAkgFpt9TxPIkLWwEDK' : 'price_1SPuemAkgFpt9TxPfqikl4td',
        price: 2520,
        name: 'Enterprise Plan',
        duration: '/year',
    }
];