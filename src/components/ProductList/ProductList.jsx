import { useState } from "react"
import "./ProductList.scss"
import logo from "../../assets/monklogo.svg"
import penIcon from "../../assets/pen_icon.svg"
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import ProductPicker from "../ProductPicker/ProductPicker";

function ProductList () {
    const [listOfProducts, setListOfProducts] = useState([{pid: `prod${Math.random().toPrecision(4)*10000}`, product: "", discountSet: false, discount: {} }])
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
        setListOfProducts([...listOfProducts, {pid: `prod${Math.random().toPrecision(4)*10000}`, product: "", discountSet: false, discount: {}}])
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
                        <div className="products-list-data-row">
                            <div></div>
                            <div className="list-product-title-cnt">
                                <span>{item.product.length > 0 ? item.product : "Select Product"}</span>
                                <img src={penIcon} alt="Pencil Icon" onClick={() => setOpenProdPicker(true)}/>
                            </div>
                            <div>
                            {!item.discountSet ? <button onClick={() => handleDiscount("toggle", item)}>Add Discount</button>
                                : <>
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
                            }</div>
                        </div>
                    )}
                    <button onClick={handleAddProduct}>Add Product</button>
                </div>
                <Modal
                    open={openProdPicker}
                    onClose={() => setOpenProdPicker(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <ProductPicker/>
                </Modal>
            </section>
        </main>
    )
}

export default ProductList
