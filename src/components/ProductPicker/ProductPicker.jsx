import { closeIcon, searchIcon } from "../../assets/IconnsConfig"
import { searchProductsApiCall } from "../../utils/Api"
import { useEffect, useRef, useState } from "react"
import { CircularProgress } from "@mui/material"
import "./ProductPicker.scss"

function ProductPicker ({updateProductList, existingProducts, ...props}) {
    const [pageNo, setPageNo] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchProdList, setSearchProdList] = useState([])
    const [selectedProdList, setSelectedProdList] = useState(existingProducts.filter(item => item?.id))
    const [loading, setLoading] = useState(true)
    const listContainerRef = useRef(null)

    useEffect(() => {
        fetchProducts("")
    }, [])
   
    const searchAPIHandler = (cb, delay = 1000) => {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                cb(...args)
            }, delay)
        }
    }

    const fetchProducts = (query) => {
        searchProductsApiCall(query, 1).then((res) => {
            res.data ? setSearchProdList(res?.data) : setSearchProdList([]);
            setLoading(false)
        }).catch((err) => {
            setSearchProdList([])
            setLoading(false)
            console.log(err);
        })
    }

    const handleSearchProduct = searchAPIHandler((query) => {
        setLoading(true)
        setSearchQuery(query)
        if(pageNo > 1) setPageNo(1)
        fetchProducts(query)
    }, 1000)
   
    const getVariantsWithDiscount = (variantsList) => {
        return variantsList.map((item) => {return {...item, discount: {value: "", type: ""}}})
    }

    const handleSelectProduct = (product) => {
        const isProductPresent = selectedProdList.filter((item) => item.id === product.id)

        isProductPresent.length ? setSelectedProdList(selectedProdList.filter((item) => item.id !== product.id))
            : setSelectedProdList([...selectedProdList, {pid: `prod${Math.random().toPrecision(4)*10000}`, id: product.id, product: product.title, discount: {value: "", type: ""}, variants: getVariantsWithDiscount(product.variants)}])
    }

    const handleSelectVariant = (product, variant) => {
        const isProductPresent = selectedProdList.filter((item) => item.id === product.id)

        if(!isProductPresent.length) {
            setSelectedProdList([...selectedProdList, {pid: `prod${Math.random().toPrecision(4)*10000}`, id: product.id, product: product.title, discount: { value: "", type: ""}, variants: [{...variant, discount: {value: "", type: ""}}]}])
        } else {
            const isVariantPresent = isProductPresent[0].variants.filter((item) => item.id === variant.id)

            if(isVariantPresent.length && isProductPresent[0].variants.length === 1) {
                setSelectedProdList(selectedProdList.filter(item => item.id !== isProductPresent[0].id))
                return
            }
            
            isVariantPresent.length ? isProductPresent[0].variants = isProductPresent[0].variants.filter((item) => item.id !== variant.id)
                : isProductPresent[0].variants = [...isProductPresent[0].variants, {...variant, discount: {value: "", type: ""}}]

                setSelectedProdList(selectedProdList.map((item) => {
                if(item.id === isProductPresent[0].id)
                    return isProductPresent[0]
                return item
            }))    
        }
    }

    const handleMarkUnmarkVariants = (product, variantId) => {
        let flag = false
        const isProductSelected = selectedProdList.filter((item) => item.id === product.id)

        !isProductSelected.length ? flag = false : isProductSelected[0].variants.filter((item) => item.id === variantId).length > 0 ? flag = true : flag = false
        return flag
    }

    const handleAddProduct = () => {
        updateProductList(selectedProdList)
    }

    const scrollAPIHandler = (func, delay = 700) => {
        let timer = null
        return (...args) => {
            if (timer) return
            timer = setTimeout(() => {
                func(...args)
                timer = null
            }, delay)
        }
    }

    const handlefetchProductsOnScroll = scrollAPIHandler(async() => {
        const container = listContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            
            if (scrollTop + clientHeight >= scrollHeight - 10 && pageNo) {
                setLoading(true)
                try {
                    const res = await searchProductsApiCall(searchQuery, pageNo + 1)
                    if (res.data == null) {
                        setPageNo(0)
                        setLoading(false)
                        return
                    }
                    setLoading(false)
                    setSearchProdList([...searchProdList, ...res.data])
                    setPageNo(pageNo + 1)
                }catch (err) {
                    setLoading(false)
                }            
            }
        }  
    }, 700)

    return (
        <div className="product-picker-main-cnt">
            <div className="product-picker-title-cnt">
                <span>Select Products</span>
                <img
                    src={closeIcon}
                    alt="Close icon" 
                    onClick={() => updateProductList()}
                />
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
                    ref={listContainerRef}
                    className="product-search-list-cnt"
                    onScroll={handlefetchProductsOnScroll}
                >
                    {(loading && searchProdList.length === 0) ? <div className="product-picker-loading-cnt"><CircularProgress /></div>
                        : !searchProdList.length ? <div className="product-picker-loading-cnt"><span>No products found</span></div>
                        : searchProdList.map((prod) =>
                            <div key={prod.id}>
                                <div className="product-picker-product-cnt">
                                    <input 
                                        type="checkbox"
                                        onChange={() => handleSelectProduct(prod)}
                                        checked={selectedProdList.filter((item) => item.id === prod.id).length}
                                    />
                                    <img src={prod?.image?.src} alt="" loading="lazy"/>
                                    <span>{prod?.title}</span>
                                </div>
                                {prod?.variants.map((prodVariant) =>
                                    <div key={prodVariant.id} className="product-picker-product-variant-cnt">
                                        <div>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectVariant(prod, prodVariant)}
                                                checked={handleMarkUnmarkVariants(prod, prodVariant.id)}
                                            />
                                            <span>{prodVariant?.title}</span>
                                        </div>
                                        <div>
                                            <span>{prodVariant?.inventory_quantity || 0} available</span>
                                            <span>${prodVariant?.price}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                    )}
                    {(loading && searchProdList.length > 0)  && <div className="product-picker-loading-cnt"><CircularProgress /></div>}
                </div>
                {searchProdList.length > 0 && 
                    <div className="product-picker-action-cnt">
                        <span>{selectedProdList.length} product selected</span>
                        <div>
                            <button 
                                className="product-picker-cancel-btn"
                                onClick={updateProductList}
                            >
                                Cancel
                            </button>
                            <button
                                className="product-picker-add-btn"
                                onClick={handleAddProduct}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default ProductPicker
