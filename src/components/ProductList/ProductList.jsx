import { useState } from "react"
import { logo } from "../../assets/IconnsConfig"
import ProductDetailsRow from "./ProductDetailsRow"
import { closestCorners, DndContext } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import "./ProductList.scss"

function ProductList () {
    const [listOfProducts, setListOfProducts] = useState([{
        pid: `prod${Math.random().toPrecision(4)*10000}`,
        product: "",
        discount: {value: "", type: ""},
        variants: [],
    }])
    
    const handleAddProduct = () => {
        setListOfProducts([...listOfProducts, {pid: `prod${Math.random().toPrecision(4)*10000}`, product: "", discount: {value: "", type: ""}, variants: []}])
    }
   
    const getTaskPos = (id) => listOfProducts.findIndex((product) => product.pid === id)

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (active.id === over.id) return

        setListOfProducts((products) => {
            const originalPos = getTaskPos(active.id)
            const newPos = getTaskPos(over.id)
            return arrayMove(products, originalPos, newPos)
        })  
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
                    <div style={{width: "100%", display: "flex", flexDirection:"column", gap: "15px"}}>
                        <DndContext
                            collisionDetection={closestCorners}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={listOfProducts.map((item) => item.pid)} strategy={verticalListSortingStrategy}>
                                {listOfProducts.map((item, index) =>
                                    <ProductDetailsRow key={item.pid} id={item.pid} index={index+1} productDetails={item} listOfProducts={listOfProducts} updateListOfProducts={setListOfProducts}/>
                                )}
                            </SortableContext>
                        </DndContext>
                    </div>
                    <button onClick={handleAddProduct}>Add Product</button>
                </div>
            </section>
        </main>
    )
}

export default ProductList