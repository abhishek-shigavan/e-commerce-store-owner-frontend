import closeIcon from "../../assets/close_grey_icon.svg"
import bulletIcon from "../../assets/bullet_icon.svg"
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import "./ProductVariantRow.scss"

function ProductVariantRow ({id, variantDetails, listOfVariants, updateListOfVariants, showDiscount = false, ...props}) {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }    
    
    const handleDiscount = (val, action) => {
        let updatedVariantsList = listOfVariants.map(item => {
            if(item.id === variantDetails.id) {
                return {
                    ...item,
                    discount: action === "discount" ? {...variantDetails.discount, value: val} : {...variantDetails.discount, type: val}
                }
            }
            return item
        })  
        updateListOfVariants(updatedVariantsList)
    }

    const handleRemoveVariant = () => {
        updateListOfVariants(listOfVariants.filter((item) => item.id != variantDetails.id))
    }


    return (
        <div
            ref={setNodeRef}
            style={style}
            className="product-variant-row-details-cnt"
        >
            <div {...attributes} {...listeners}><img src={bulletIcon} alt="Bullet icon" /></div>
            <div {...attributes} {...listeners} style={showDiscount ? {width: "calc(51% - 22px)"} : {width: "calc(91% - 22px)"}}>
                <span>{variantDetails.title}</span>
            </div>
            <div style={!showDiscount ? {width: "14px"} : {}}>
                {showDiscount && <div className="product-variant-discount-cnt">
                    <input
                        type="text"
                        value={variantDetails.discount.value}
                        onChange={(e) => handleDiscount(e.currentTarget.value, "discount")}
                        />
                    <FormControl sx={{width: "48%", height: "32px", backgroundColor: "white", borderRadius: "30px"}}>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            sx={{height: "32px", borderRadius: "30px"}}
                            value={variantDetails.discount.type}
                            className="xyz"
                            fullWidth
                            onChange={(e) => handleDiscount(e.target.value, "discountType")}
                            >
                            <MenuItem value="% Off">% off</MenuItem>
                            <MenuItem value="Flat">flat</MenuItem>
                        </Select>
                    </FormControl>
                </div>}
                <img 
                    src={closeIcon}
                    alt="Close icon"
                    onClick={handleRemoveVariant}
                />
            </div>
        </div>
    )
}

export default ProductVariantRow
