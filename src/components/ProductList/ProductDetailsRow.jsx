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

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, 
        animateLayoutChanges: () => false 
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }    

    
    const handleDiscount = (val, action) => {
        let updatedList = []
        if(action === "discount" || action === "discountType") {
            updatedList = listOfProducts.map(item => {
                if(item.id == productDetails.id) {
                    return {
                        ...item,
                        discount: action === "discount" ? {...productDetails.discount, value: val} : {...productDetails.discount, type: val}
                    }
                }
                return item
            })   
        }
        updateListOfProducts(updatedList)
    }

    const handleShowHideVariants = (product) => {
        updateListOfProducts(listOfProducts.map(item => {
            if(item.id == product.id) {
                return {...item, hideVariants: !product.hideVariants}
            }
            return item
        }))   
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
            {...attributes}
            {...listeners}
            className="product-details-row-main-cnt"
        >
            <div className="products-list-data-row">
                <div><img src={bulletIcon} alt="Bullet icon" />{index}.</div>
                <div className="list-product-title-cnt">
                    <span>{productDetails.product.length > 0 ? productDetails.product : "Select Product"}</span>
                    <img src={penIcon} alt="Pencil Icon" onClick={() => setOpenProdPicker(productDetails.pid)} onPointerDown={(e) => e.stopPropagation()} />
                </div>
                <div>
                    {!discountAdded ? <button onClick={() => setDiscountAdded(true)} onPointerDown={(e) => e.stopPropagation()}>Add Discount</button>
                        : 
                            <>
                                <input 
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onChange={(e) => handleDiscount(e.currentTarget.value, "discount")}
                                    value={productDetails?.discount?.value}    
                                />
                                <FormControl
                                    sx={{width: "48%", height: "32px", backgroundColor: "white"}}
                                >
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        sx={{height: "34px"}}
                                        className="xyz"
                                        fullWidth
                                        onPointerDown={(e) => e.stopPropagation()}
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
                                    onPointerDown={(e) => e.stopPropagation()}
                                />
                            </>
                    }
                </div>
            </div>
            {productDetails.variants.length > 0 && 
                 <div className="product-list-variant-cnt">
                    {productDetails.hideVariants ? <div className="product-list-variant-btn-img-cnt">
                            <span onClick={() => handleShowHideVariants(productDetails)}>Show Variants</span>
                            <img src={downArrowIcon} alt="" srcset="" />
                        </div>
                        : <>
                            <div className="product-list-variant-btn-img-cnt">
                                <span onClick={() => handleShowHideVariants(productDetails)}>Hide Variants</span>
                                <img src={upArrowIcon} alt="" />
                            </div>
                            {productDetails.variants.map((variantItem) =>
                                <div className="product-list-variant-details-cnt">
                                    <div><img src={bulletIcon} alt="Bullet icon" /></div>
                                    <div style={discountAdded ? {width: "calc(50% - 22px)"} : {width: "calc(91% - 22px)"}}>
                                        <span>{variantItem.title}</span>
                                    </div>
                                    {discountAdded && <div>
                                        <input type="text" value={productDetails.discount.value}/>
                                        <FormControl
                                            sx={{width: "48%", height: "32px", backgroundColor: "white", borderRadius: "30px"}}
                                        >
                                            <Select
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                sx={{height: "32px", borderRadius: "30px"}}
                                                value={productDetails.discount.type}
                                                className="xyz"
                                                fullWidth
                                                >
                                                <MenuItem value="% Off">% off</MenuItem>
                                                <MenuItem value="Flat">flat</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <img 
                                            src={closeIcon}
                                            alt="Close icon"
                                            onClick={() => handleRemoveProductOrVariant(productDetails, variantItem)}
                                            onPointerDown={(e) => e.stopPropagation()}
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
                onPointerDown={(e) => e.stopPropagation()} 
            >
                <ProductPicker updateProductList={updateProductList}/>
            </Modal>
        </div>
    )
}

export default ProductDetailsRow
