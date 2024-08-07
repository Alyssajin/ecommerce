import React, {useState} from 'react'
import './css/ShopCategory.css'
import Item from '../components/item/Item'
import { ShopContext } from '../context/ShopContext'
import data from "../assets/products.json"
import PaginationNew from '../components/pagination/PaginationNew' // PaginationNew to be finalized

const ShopCategory = (props) => {
    // const { all_products } = useContext(ShopContext)
    // read data from the products.json file
    const all_products = data
    const PRODUCTS_PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(all_products.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = all_products.slice(startIndex, endIndex);

    return (
        <div className='shop-category'>
            <PaginationNew fallbackPerPage={PRODUCTS_PER_PAGE} currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages} />
            <img className='shop-category-banner' src={props.banner} alt="" />
            <div className="shop-category-title-sort">
                <div className="shop-category-title">
                    <p>{props.title}</p>
                </div>
                <div className="shop-category-sort">
                    <label className='shop-category-grid-sort'>Sort:</label>
                    <select className='shop-category-grid-sort-select'>
                        <option value='default'>Featured</option>
                        <option value='priceAscending'>Price: Low to High</option>
                        <option value='priceDescending'>Price: High to Low</option>
                        <option value='newest'>Newest</option>
                        <option value='bestSelling'>Best Sellers</option>
                        <option value='rating'>Highest Rating</option>
                        <option value='nameAscending'>A-Z</option>
                        <option value='nameDescending'>Z-A</option>
                    </select>
                </div>
                {/* employ a nav for pagination. created in the future */}
            </div>
            <div className="shop-category-products">
                {currentProducts.map((item, i) => {
                    if (props.category === item.category) {
                        return (
                            <Item
                                key={i}
                                id={item.id}
                                image={item.image}
                                brand={item.brand}
                                name={item.name}
                                price={item.price}
                            />
                        )
                    } else {
                        return null
                    }
                })}
            </div>
            {/* employ a nav for pagination. created in the future */}
        </div>
    )
}

export default ShopCategory