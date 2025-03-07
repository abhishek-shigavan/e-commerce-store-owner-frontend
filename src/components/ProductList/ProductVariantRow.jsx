import closeIcon from "../../assets/close_grey_icon.svg"
import bulletIcon from "../../assets/bullet_icon.svg"
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function ProductVariantRow ({id, variantDetails, listOfVariants, variantsList, showDiscount = false, ...props}) {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }    
    
    return (
        <div
            ref={setNodeRef}
            style={style}
            className="product-list-variant-details-cnt"
        >
            <div {...attributes} {...listeners}><img src={bulletIcon} alt="Bullet icon" /></div>
            <div {...attributes} {...listeners} style={showDiscount ? {width: "calc(50% - 22px)"} : {width: "calc(91% - 22px)"}}>
                <span>{variantDetails.title}</span>
            </div>
            {showDiscount && <div>
                <input
                    type="text"
                    value={variantDetails.discount.value}
                    // onChange={(e) => handleDiscount(e.currentTarget.value, "variantDiscount", variantItem)}
                />
                <FormControl sx={{width: "48%", height: "32px", backgroundColor: "white", borderRadius: "30px"}}>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        sx={{height: "32px", borderRadius: "30px"}}
                        value={variantDetails.discount.type}
                        className="xyz"
                        fullWidth
                        // onChange={(e) => handleDiscount(e.target.value, "variantDiscountType", variantItem)}
                    >
                        <MenuItem value="% Off">% off</MenuItem>
                        <MenuItem value="Flat">flat</MenuItem>
                    </Select>
                </FormControl>
                <img 
                    src={closeIcon}
                    alt="Close icon"
                    // onClick={() => handleRemoveProductOrVariant(productDetails, variantItem)}
                />
            </div>}
        </div>
    )
}

export default ProductVariantRow
