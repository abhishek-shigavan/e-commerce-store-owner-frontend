import { useState } from "react"
import "./ProductList.scss"
import logo from "../../assets/monklogo.svg"
import penIcon from "../../assets/pen_icon.svg"
import upArrowIcon from "../../assets/up_arrow.svg"
import downArrowIcon from "../../assets/down_arrow.svg"
import closeIcon from "../../assets/close_icon.svg"
import bulletIcon from "../../assets/bullet_icon.svg"
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import ProductPicker from "../ProductPicker/ProductPicker";

function ProductList () {
    const [listOfProducts, setListOfProducts] = useState([{
        pid: `prod${Math.random().toPrecision(4)*10000}`,
        product: "",
        discountSet: false,
        discount: {},
        variants: [],
        hideVariants: true
    }])
    const [openProdPicker, setOpenProdPicker] = useState(false)

    const handleDiscount = (action, value) => {
        if(action == "toggle") {
            setListOfProducts(listOfProducts.map(item => {
                if(item.pid == value.pid) {
                    return {...item, discountSet: true}
                }
                return item
            }))
        }
    }

    const handleAddProduct = () => {
        setListOfProducts([...listOfProducts, {pid: `prod${Math.random().toPrecision(4)*10000}`, product: "", discountSet: false, discount: {}, variants: [], hideVariants: true}])
    }

    const updateListOfProduct = (selectedProduct = []) => {
        if(selectedProduct.length) {
            setListOfProducts(listOfProducts.flatMap(item => {
                if(item.pid == openProdPicker) 
                    return selectedProduct
                return item
            }))
        }
        setOpenProdPicker("")
    }

    const handleShowHideVariants = (product) => {
        setListOfProducts(listOfProducts.map(item => {
            if(item.id == product.id) {
                return {...item, hideVariants: !product.hideVariants}
            }
            return item
        }))   
    }

    return (
        <main className="product-list-main-cnt">
            <header className="product-list-header-cnt">
                <img src={logo} alt="monk-logo" />
                <span>Monk Upsell & Cross-sell</span>
            </header>
            <section className="product-list-content-cnt">
                <div className="add-products-main-cnt">

                    <span>Add Products</span>
                    <div className="products-list-head-row">
                        <div></div>
                        <div><span>Product</span></div>
                        <div><span>Discount</span></div>
                    </div>
                    {listOfProducts.map((item) =>
                        <div style={{width: "100%", display: "flex", flexDirection: "column"}}>
                        <div className="products-list-data-row">
                            <div><img src={bulletIcon} alt="Bullet icon" /></div>
                            <div className="list-product-title-cnt">
                                <span>{item.product.length > 0 ? item.product : "Select Product"}</span>
                                <img src={penIcon} alt="Pencil Icon" onClick={() => setOpenProdPicker(item.pid)}/>
                            </div>
                            <div>
                                {!item.discountSet ? <button onClick={() => handleDiscount("toggle", item)}>Add Discount</button>
                                    : <div>
                                        <>
                                            <input/>
                                            <FormControl
                                                sx={{width: "40%", height: "32px", backgroundColor: "white"}}
                                            >
                                                <Select
                                                    labelId="demo-simple-select-autowidth-label"
                                                    id="demo-simple-select-autowidth"
                                                    sx={{height: "32px"}}
                                                    className="xyz"
                                                    fullWidth
                                                    >
                                                  <MenuItem value="% Off">% off</MenuItem>
                                                  <MenuItem value={"Flat"}>flat</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </>
                                        
                                      </div>
                                }
                            </div>
                        </div>
                        {item.variants.length > 0 && 
                             <div className="product-list-variant-cnt">
                                {item.hideVariants ? <div className="product-list-variant-btn-img-cnt">
                                        <span onClick={() => handleShowHideVariants(item)}>Show Variants</span>
                                        <img src={downArrowIcon} alt="" srcset="" />
                                    </div>
                                    : <>
                                        <div className="product-list-variant-btn-img-cnt">
                                            <span onClick={() => handleShowHideVariants(item)}>Hide Variants</span>
                                            <img src={upArrowIcon} alt="" />
                                        </div>
                                        {item.variants.map((variantItem) => 
                                            <div className="product-list-variant-details-cnt">
                                                <div><img src={bulletIcon} alt="Bullet icon" /></div>
                                                <div>
                                                    <span>{variantItem.title}</span>
                                                </div>
                                                <div>
                                                    <input type="text" />
                                                    <FormControl
                                                        sx={{width: "44%", height: "32px", backgroundColor: "white", borderRadius: "30px"}}
                                                    >
                                                        <Select
                                                            labelId="demo-simple-select-autowidth-label"
                                                            id="demo-simple-select-autowidth"
                                                            sx={{height: "32px", borderRadius: "30px"}}
                                                            className="xyz"
                                                            fullWidth
                                                            >
                                                          <MenuItem value="% Off">% off</MenuItem>
                                                          <MenuItem value={"Flat"}>flat</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <img src={closeIcon} alt="Close icon" />
                                            </div>
                                        )}
                                    </>
                                }        
                            </div>
                        }
                        </div>
                    )}
                    <button onClick={handleAddProduct}>Add Product</button>
                </div>
                <Modal
                    open={openProdPicker.length}
                    onClose={() => setOpenProdPicker("")}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <ProductPicker updateProductList={updateListOfProduct}/>
                </Modal>
            </section>
        </main>
    )
}

export default ProductList
