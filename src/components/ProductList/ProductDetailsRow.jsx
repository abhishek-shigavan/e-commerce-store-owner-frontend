import { useEffect, useState } from "react"
import {penIcon, upArrowIcon, downArrowIcon, closeGreyIcon, bulletIcon } from "../../assets/IconnsConfig"
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Modal from '@mui/material/Modal'
import ProductPicker from "../ProductPicker/ProductPicker"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { closestCorners, DndContext } from "@dnd-kit/core"
import ProductVariantRow from "./ProductVariantRow"
import "./ProductDetailsRow.scss"

function ProductDetailsRow ({id, index, productDetails, listOfProducts, updateListOfProducts, ...props}) {
    const [openProdPicker, setOpenProdPicker] = useState(false)
    const [discountAdded, setDiscountAdded] = useState(productDetails?.discount?.value.length || productDetails?.discount?.type.length ? true : false)
    const [hideVariants, setHideVariants] = useState(true)
    const [listOfVariants, setListOfVariants] = useState([])

    useEffect(() => {
        setListOfVariants(productDetails.variants)        
    }, [productDetails])

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

    const handleDiscount = (val, action) => {
        let isVariantDiscountAdded = false
        for(let item of productDetails.variants) {
            let isPresent = action === "discount" ? item.discount.value.length : item.discount.type.length
            if(isPresent) {
                isVariantDiscountAdded = true
                break
            }
        }

        const updatedListOfProducts = listOfProducts.map(item => {
            if(item.id === productDetails.id) {
                return {
                    ...item,
                    discount: action === "discount" ? {...productDetails.discount, value: val} : {...productDetails.discount, type: val},
                    variants: isVariantDiscountAdded ? productDetails.variants : getVariantsWithDiscount(productDetails.variants, val, action)
                }
            }
            return item
        })   
        updateListOfProducts(updatedListOfProducts)
    }

    const updateProductList = (selectedProduct = []) => {
        if(selectedProduct.length) {
            updateListOfProducts(listOfProducts.flatMap(item => {
                if(item.pid === openProdPicker) 
                    return selectedProduct
                return item
            }))
        }
        setOpenProdPicker("")
    }

    const handleRemoveProduct = () => {
        updateListOfProducts(listOfProducts.filter(item => item.id !== productDetails.id))
    }

    const handleListOfVariantsUpdate = (updatedVariantsList) => {
        let updatedListOfProducts = []
        if(updatedVariantsList.length) {
            updatedListOfProducts = listOfProducts.map((item) => {
                if(item.id === productDetails.id) {
                    return {...productDetails, variants: updatedVariantsList}
                }
                return item
            })
        } else {
            updatedListOfProducts = listOfProducts.filter(item => item.id !== productDetails.id)
        }
        updateListOfProducts(updatedListOfProducts)
    }

    const getTaskPos = (id) => listOfVariants.findIndex((variant) => variant.id === id)
    
    const handleDragEnd = (event) => {
        const { active, over } = event
        if (active.id === over.id) return

        setListOfVariants((variant) => {
            const originalPos = getTaskPos(active.id)
            const newPos = getTaskPos(over.id)
            return arrayMove(variant, originalPos, newPos)
        })  
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="product-details-row-main-cnt"
        >
            <div className="products-details-data-row">
                <div {...attributes} {...listeners}><img src={bulletIcon} alt="Bullet icon" />{index}.</div>
                <div className="product-details-data-row-title-cnt">
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
                            onClick={() => {
                                if(!productDetails.product?.length) return
                                setDiscountAdded(true)

                            }}
                        >
                            Add Discount
                        </button>
                        : 
                            <>
                                <div className="product-details-discount-cnt">
                                    <input 
                                        onChange={(e) => handleProductDiscountChange(e)}
                                        // value={productDetails?.discount?.value}    
                                    />
                                    <FormControl sx={{width: "53%", height: "32px", backgroundColor: "white"}}>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            sx={{height: "34px"}}
                                            fullWidth
                                            value={productDetails.discount.type}
                                            onChange={(e) => handleDiscount(e?.target?.value, "discountType")}
                                        >
                                            <MenuItem value={"% Off"}>% off</MenuItem>
                                            <MenuItem value={"Flat"}>flat</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <img
                                    src={closeGreyIcon}
                                    alt="Close icon"
                                    onClick={handleRemoveProduct}
                                />
                            </>
                    }
                </div>
            </div>
            {productDetails.variants.length > 0 && 
                <div className="product-details-variant-cnt">
                    {hideVariants ? 
                        <div
                            className="product-details-variant-btn-img-cnt"
                            onClick={() => setHideVariants(!hideVariants)}
                        >
                            <span>Show Variants</span>
                            <img src={downArrowIcon} alt="" />
                        </div>
                        : <>
                            <div 
                                className="product-details-variant-btn-img-cnt"
                                onClick={() => setHideVariants(!hideVariants)}
                            >
                                <span>Hide Variants</span>
                                <img src={upArrowIcon} alt="" />
                            </div>
                            <div className="product-details-variants-list-items-cnt">
                                <DndContext
                                    collisionDetection={closestCorners}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext items={listOfVariants.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                                        {listOfVariants.map((item, index) =>
                                            <ProductVariantRow key={item.id} id={item.id} variantDetails={item} listOfVariants={listOfVariants} updateListOfVariants={handleListOfVariantsUpdate} showDiscount={discountAdded}/>
                                        )}
                                    </SortableContext>
                                </DndContext>
                            </div>
                            <div className="product-details-variants-divider"></div>
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
