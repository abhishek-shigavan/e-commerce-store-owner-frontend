import "./ProductList.scss"
import logo from "../../assets/monklogo.svg"
import penIcon from "../../assets/pen_icon.svg"
import { useState } from "react"

function ProductList () {
    const [listOfProducts, setListOfProducts] = useState([{product: "", discount: null}])

    const handleAddProduct = () => {
        setListOfProducts([...listOfProducts, {product: "", discount: null}])
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
                                <img src={penIcon} alt="Pencil Icon" />
                            </div>
                            <div><button>Add Discount</button></div>
                        </div>
                    )}
                    <button onClick={handleAddProduct}>Add Product</button>
                </div>
            </section>
        </main>
    )
}

export default ProductList
