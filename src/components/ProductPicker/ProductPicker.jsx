import "./ProductPicker.scss"
import closeIcon from "../../assets/close_icon.svg"
import searchIcon from "../../assets/search_icon.svg"
import { searchProductsApiCall } from "../../utils/Api"
import { useState } from "react"
import ProductList from "../ProductList/ProductList"

function ProductPicker () {
    const [pageNo, setPageNo] = useState(1)
    const [searchProdList, setSearchProdList] = useState([])

    const delayedAPICall = (cb, delay = 1000) => {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                cb(...args)
            }, delay)
        }
    }

    const handleSearchProduct = delayedAPICall((query) => {
        if(!query.length) {
            setSearchProdList([])
            return
        }
        searchProductsApiCall(query, 1).then((res) => {
            res.data ? setSearchProdList(res?.data) : console.log("no results");
        }).catch((err) => {
            console.log(err);
        })
    }, 1000)

    return (
        <div className="product-picker-main-cnt">
            <div className="product-picker-title-cnt">
                <span>Select Products</span>
                <img src={closeIcon} alt="Close icon" />
            </div>
            <div className="product-picker-search-cnt">
                <img src={searchIcon} alt="Search icon" />
                <input
                    type="text"
                    placeholder="Search product"
                    onChange={(e) => handleSearchProduct(e.currentTarget.value)}    
                />
            </div>
            <div className="product-search-divider-cnt"></div>
            <div className="product-search-list-cnt">
                {searchProdList.map((prod) =>
                    <>
                        <div>
                            <label>
                                <input type="checkbox" />
                                {prod?.title}
                            </label>
                        </div>
                        {prod?.variants.map((prodVariant) =>
                            <div>
                                <label>
                                    <input type="checkbox" />
                                    {prodVariant?.title}
                                </label>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ProductPicker
