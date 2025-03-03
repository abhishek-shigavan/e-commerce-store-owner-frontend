import "./ProductPicker.scss"
import closeIcon from "../../assets/close_icon.svg"
import searchIcon from "../../assets/search_icon.svg"
import { searchProductsApiCall } from "../../utils/Api"
import { useEffect, useState } from "react"

function ProductPicker ({updateProductList, ...props}) {
    const [pageNo, setPageNo] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchProdList, setSearchProdList] = useState([])
    const [selectedProdList, setSelectedProdList] = useState([])
   
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
        setSearchQuery(query)
        if(pageNo > 1) setPageNo(1)
        searchProductsApiCall(query, 1).then((res) => {
            res.data ? setSearchProdList(res?.data) : console.log("no results");
        }).catch((err) => {
            console.log(err);
        })
    }, 1000)

    const handleSelectProduct = (product) => {
        const isProductPresent = selectedProdList.filter((item) => item.id == product.id)

        isProductPresent.length ? setSelectedProdList(selectedProdList.filter((item) => item.id != product.id))
            : setSelectedProdList([...selectedProdList, {pid: `prod${Math.random().toPrecision(4)*10000}`, id: product.id, product: product.title, discountSet: false, discount: {}, variants: [], hideVariants: true}])
    }

    const handleSelectVariant = (product, variant) => {
        const isProductPresent = selectedProdList.filter((item) => item.id == product.id)

        if(!isProductPresent.length) {
            setSelectedProdList([...selectedProdList, {pid: `prod${Math.random().toPrecision(4)*10000}`, id: product.id, product: product.title, discountSet: false, discount: {}, variants: [variant], hideVariants: true}])
        } else {
            const isVariantPresent = isProductPresent[0].variants.filter((item) => item.id == variant.id)

            isVariantPresent.length ? isProductPresent[0].variants = isProductPresent[0].variants.filter((item) => item.id != variant.id)
                : isProductPresent[0].variants = [...isProductPresent[0].variants, variant]

            setSelectedProdList(selectedProdList.map((item) => {
                if(item.id == isProductPresent[0].id)
                    return isProductPresent[0]
                return item
            }))    
        }
    }

    const handleMarkUnmarkVariants = (product, variantId) => {
        let flag = false
        const isProductSelected = selectedProdList.filter((item) => item.id == product.id)

        !isProductSelected.length ? flag = false : isProductSelected[0].variants.filter((item) => item.id == variantId).length > 0 ? flag = true : flag = false
        return flag
    }

    const handleAddProduct = () => {
        updateProductList(selectedProdList)
    }

    const handlefetchProductsOnScroll = delayedAPICall(() => {
        if(pageNo) {
            searchProductsApiCall(searchQuery, pageNo + 1).then((res) => {
                if (res.data == null) {
                    setPageNo(0)
                    return
                }
                setSearchProdList([...searchProdList, ...res.data])
                setPageNo(pageNo + 1)
            }).catch((err) => {
                console.log(err);
            })
        }    
    }, 700)

    return (
        <div className="product-picker-main-cnt">
            <div className="product-picker-title-cnt">
                <span>Select Products</span>
                <img src={closeIcon} alt="Close icon" onClick={updateProductList}/>
            </div>
            <div className="product-picker-search-cnt">
                <img src={searchIcon} alt="Search icon" />
                <input
                    type="text"
                    placeholder="Search product"
                    onChange={(e) => handleSearchProduct(e.currentTarget.value)}    
                />
            </div>
            <div className="product-picker-search-divider-cnt"></div>
            <div className="product-search-list-action-cnt">
                <div 
                    className="product-search-list-cnt"
                    onScroll={handlefetchProductsOnScroll}
                >
                    {searchProdList.map((prod) =>
                        <>
                            <div>
                                <img src={prod?.image?.src} style={{width: "36px", height: "36px"}}alt="" />
                                <label>
                                    <input type="checkbox" onChange={() => handleSelectProduct(prod)} checked={selectedProdList.filter((item) => item.id == prod.id).length}/>
                                    {prod?.title}
                                </label>
                            </div>
                            {prod?.variants.map((prodVariant) =>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelectVariant(prod, prodVariant)}
                                            checked={handleMarkUnmarkVariants(prod, prodVariant.id)}
                                        />
                                        {prodVariant?.title}
                                    </label>
                                    <span>{prodVariant?.inventory_quantity} available</span>
                                    <span>${prodVariant?.price}</span>

                                </div>
                            )}
                        </>
                    )}
                </div>
                {searchProdList.length > 0 && 
                    <div className="product-picker-action-cnt">
                        <span>{selectedProdList.length} product selected</span>
                        <div>
                            <button className="product-picker-cancel-btn" onClick={updateProductList}>Cancel</button>
                            <button className="product-picker-add-btn" onClick={handleAddProduct}>Add</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default ProductPicker
