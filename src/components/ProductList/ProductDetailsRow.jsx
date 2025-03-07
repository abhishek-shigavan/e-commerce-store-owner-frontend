import { useState } from "react"
import penIcon from "../../assets/pen_icon.svg"
import upArrowIcon from "../../assets/up_arrow.svg"
import downArrowIcon from "../../assets/down_arrow.svg"
import closeIcon from "../../assets/close_grey_icon.svg"
import bulletIcon from "../../assets/bullet_icon.svg"
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Modal from '@mui/material/Modal'
import ProductPicker from "../ProductPicker/ProductPicker"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import "./ProductDetailsRow.scss"

function ProductDetailsRow ({id, index, productDetails, listOfProducts, updateListOfProducts, ...props}) {
    const [openProdPicker, setOpenProdPicker] = useState(false)
    const [discountAdded, setDiscountAdded] = useState(productDetails?.discount?.value.length ? true : false)
    const [hideVariants, setHideVariants] = useState(true)

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }
    
    const getVariantsWithDiscount = (variantsList, value, action) => {
        return variantsList.map((item) => {
            return {
                ...item,
                discount: action === "discount" ? {...item.discount, value: value} : {...item.discount, type: value},
            }
        })
    }

    const delayInputValueChange = (cb, delay = 1000) => {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                cb(...args)
            }, delay)
        }
    }

    const handleProductDiscountChange = delayInputValueChange((e) => {
        handleDiscount(e.target.value, "discount")
    }, 700)

    const handleDiscount = (val, action, variantObj = {}) => {
        let updatedList = []
        if(action === "discount" || action === "discountType") {
            let isVariantDiscountAdded = false

            for(let item of productDetails.variants) {
                let isPresent = action === "discount" ? item.discount.value.length : item.discount.type.length
                if(isPresent) {
                    isVariantDiscountAdded = true
                    break
                }
            }

            updatedList = listOfProducts.map(item => {
                if(item.id == productDetails.id) {
                    return {
                        ...item,
                        discount: action === "discount" ? {...productDetails.discount, value: val} : {...productDetails.discount, type: val},
                        variants: isVariantDiscountAdded ? productDetails.variants : getVariantsWithDiscount(productDetails.variants, val, action)
                    }
                }
                return item
            })   
        } else if(action === "variantDiscount" || action === "variantDiscountType") {
            let updatedVariantsList = productDetails.variants.map(item => {
                if(item.id === variantObj.id) {
                    return {
                        ...item,
                        discount: action === "variantDiscount" ? {...variantObj.discount, value: val} : {...variantObj.discount, type: val}
                    }
                }
                return item
            })
            updatedList = listOfProducts.map(item => {
                if(item.id == productDetails.id) {
                    return {...item, variants: updatedVariantsList}
                }
                return item
            })
        }
        updateListOfProducts(updatedList)
    }

    const updateProductList = (selectedProduct = []) => {
        if(selectedProduct.length) {
            updateListOfProducts(listOfProducts.flatMap(item => {
                if(item.pid == openProdPicker) 
                    return selectedProduct
                return item
            }))
        }
        setOpenProdPicker("")
    }

    const handleRemoveProductOrVariant = (product, variant=null) => {
        if(variant) {
            product.variants = product.variants.filter((item) => item.id != variant.id)
            updateListOfProducts(listOfProducts.map((item) => {
                if(item.id == product.id)
                    return product
                return item
            }))    
        } else {
            updateListOfProducts(listOfProducts.filter(item => item.id !== product.id))
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="product-details-row-main-cnt"
        >
            <div className="products-list-data-row">
                <div {...attributes} {...listeners}><img src={bulletIcon} alt="Bullet icon" />{index}.</div>
                <div className="list-product-title-cnt">
                    <span {...attributes} {...listeners}>{productDetails.product.length > 0 ? productDetails.product : "Select Product"}</span>
                    <img
                        src={penIcon} 
                        alt="Pencil Icon" 
                        onClick={() => setOpenProdPicker(productDetails.pid)}
                    />
                </div>
                <div>
                    {!discountAdded ?
                        <button
                            onClick={() => setDiscountAdded(true)}
                        >
                            Add Discount
                        </button>
                        : 
                            <>
                                <input 
                                    onChange={(e) => handleProductDiscountChange(e)}
                                    // value={productDetails?.discount?.value}    
                                />
                                <FormControl sx={{width: "48%", height: "32px", backgroundColor: "white"}}>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        sx={{height: "34px"}}
                                        className="xyz"
                                        fullWidth
                                        value={productDetails.discount.type}
                                        onChange={(e) => handleDiscount(e?.target?.value, "discountType")}
                                    >
                                        <MenuItem value={"% Off"}>% off</MenuItem>
                                        <MenuItem value={"Flat"}>flat</MenuItem>
                                    </Select>
                                </FormControl>
                                <img
                                    src={closeIcon}
                                    alt="Close icon"
                                    onClick={() => handleRemoveProductOrVariant(productDetails)}
                                />
                            </>
                    }
                </div>
            </div>
            {productDetails.variants.length > 0 && 
                 <div className="product-list-variant-cnt">
                    {hideVariants ? 
                        <div
                            className="product-list-variant-btn-img-cnt"
                            onClick={() => setHideVariants(!hideVariants)}
                        >
                            <span>Show Variants</span>
                            <img src={downArrowIcon} alt="" />
                        </div>
                        : <>
                            <div 
                                className="product-list-variant-btn-img-cnt"
                                onClick={() => setHideVariants(!hideVariants)}
                            >
                                <span>Hide Variants</span>
                                <img src={upArrowIcon} alt="" />
                            </div>
                            {productDetails.variants.map((variantItem) =>
                                <div className="product-list-variant-details-cnt">
                                    <div {...attributes} {...listeners}><img src={bulletIcon} alt="Bullet icon" /></div>
                                    <div {...attributes} {...listeners} style={discountAdded ? {width: "calc(50% - 22px)"} : {width: "calc(91% - 22px)"}}>
                                        <span>{variantItem.title}</span>
                                    </div>
                                    {discountAdded && <div>
                                        <input
                                            type="text"
                                            value={variantItem.discount.value}
                                            onChange={(e) => handleDiscount(e.currentTarget.value, "variantDiscount", variantItem)}
                                        />
                                        <FormControl sx={{width: "48%", height: "32px", backgroundColor: "white", borderRadius: "30px"}}>
                                            <Select
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                sx={{height: "32px", borderRadius: "30px"}}
                                                value={variantItem.discount.type}
                                                className="xyz"
                                                fullWidth
                                                onChange={(e) => handleDiscount(e.target.value, "variantDiscountType", variantItem)}
                                            >
                                                <MenuItem value="% Off">% off</MenuItem>
                                                <MenuItem value="Flat">flat</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <img 
                                            src={closeIcon}
                                            alt="Close icon"
                                            onClick={() => handleRemoveProductOrVariant(productDetails, variantItem)}
                                        />
                                    </div>}
                                </div>
                            )}
                            <div className="product-list-variants-divider"></div>
                        </>
                    }        
                </div>
            }
            <Modal
                open={openProdPicker.length}
                onClose={() => setOpenProdPicker("")}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{width: "100%", height: "100vh", display: "flex", alignItems: "center"}}
            >
                <ProductPicker updateProductList={updateProductList}/>
            </Modal>
        </div>
    )
}

export default ProductDetailsRow
