import { useState } from "react"
import "./ProductList.scss"
import logo from "../../assets/monklogo.svg"
import ProductDetailsRow from "./ProductDetailsRow"
import { closestCorners, DndContext } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

function ProductList () {
    const [listOfProducts, setListOfProducts] = useState([{
        pid: `prod${Math.random().toPrecision(4)*10000}`,
        product: "",
        discountSet: false,
        discount: { value: "", type: "% Off"},
        variants: [],
        hideVariants: true
    }])
    
    const handleAddProduct = () => {
        setListOfProducts([...listOfProducts, {pid: `prod${Math.random().toPrecision(4)*10000}`, product: "", discountSet: false, discount: {value: "", type: "% Off"}, variants: [], hideVariants: true}])
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