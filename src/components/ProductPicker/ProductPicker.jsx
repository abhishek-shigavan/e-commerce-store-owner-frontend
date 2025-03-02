import "./ProductPicker.scss"
import closeIcon from "../../assets/close_icon.svg"
import searchIcon from "../../assets/search_icon.svg"
import { searchProductsApiCall } from "../../utils/Api"
import { useState } from "react"

function ProductPicker ({updateProductList, ...props}) {
    const [pageNo, setPageNo] = useState(1)
    const [searchProdList, setSearchProdList] = useState([])
    // const [selectedProdList, setSelectedProdList] = useState([])
    let selectedProdList = []

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

    const handleSelectProduct = (product) => {
        const isProductPresent = selectedProdList.filter((item) => item.id == product.id)

        isProductPresent.length ? selectedProdList = selectedProdList.filter((item) => item.id != product.id)
            : selectedProdList.push({pid: `prod${Math.random().toPrecision(4)*10000}`, id: product.id, product: product.title, discountSet: false, discount: {}, variants: []})
    }

    const handleSelectVariant = (product, variant) => {
        const isProductPresent = selectedProdList.filter((item) => item.id == product.id)

        if(!isProductPresent.length) {
            selectedProdList.push({pid: `prod${Math.random().toPrecision(4)*10000}`, id: product.id, product: product.title, discountSet: false, discount: {}, variants: [variant]})
        } else {
            const isVariantPresent = isProductPresent[0].variants.filter((item) => item.id == variant.id)

            isVariantPresent.length ? isProductPresent[0].variants = isProductPresent[0].variants.filter((item) => item.id != variant.id)
                : isProductPresent[0].variants = [...isProductPresent[0].variants, variant]

            selectedProdList = selectedProdList.map((item) => {
                if(item.id == isProductPresent[0].id)
                    return isProductPresent[0]
                return item
            })    
        }
    }

    const handleAddProduct = () => {
        updateProductList(selectedProdList)
    }

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
                            <img src={prod?.image?.src} style={{width: "36px", height: "36px"}}alt="" />
                            <label>
                                <input type="checkbox" onChange={() => handleSelectProduct(prod)}/>
                                {prod?.title}
                            </label>
                        </div>
                        {prod?.variants.map((prodVariant) =>
                            <div>
                                <label>
                                    <input type="checkbox" onChange={() => handleSelectVariant(prod, prodVariant)}/>
                                    {prodVariant?.title}
                                </label>
                                <span>{prodVariant?.inventory_quantity} available</span>
                                <span>${prodVariant?.price}</span>

                            </div>
                        )}
                    </>
                )}
                <div>
                    <button>Cancel</button>
                    <button onClick={handleAddProduct}>Add</button>
                </div>
            </div>
        </div>
    )
}

export default ProductPicker
