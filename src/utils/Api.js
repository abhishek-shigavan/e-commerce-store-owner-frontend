import axios from "axios"

export const searchProductsApiCall = (searchQuery = "", page = 1) => {
    return axios.get(`https://stageapi.monkcommerce.app/task/products/search?search=${searchQuery}&page=${page}&limit=10`, {
        headers: {
            "x-api-key" : "72njgfa948d9aS7gs5"
        }
    })
}