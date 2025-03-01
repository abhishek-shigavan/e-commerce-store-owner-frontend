import "./ProductList.scss"
import logo from "../../assets/monklogo.svg"

function ProductList () {
    return (
        <main className="product-list-main-cnt">
            <header className="product-list-header-cnt">
                <img src={logo} alt="monk-logo" />
                <span>Monk Upsell & Cross-sell</span>
            </header>
            <section className="product-list-content-cnt">
                <span>Add Products</span>
                <button>Add Product</button>
            </section>
        </main>
    )
}

export default ProductList
