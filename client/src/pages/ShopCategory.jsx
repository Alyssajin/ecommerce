import React, {useContext, useEffect, useState} from 'react'
import './css/ShopCategory.css'
import Item from '../components/item/Item'
import { ShopContext } from '../context/ShopContext'
import { SearchContext } from "../context/SearchContext";

import PaginationNew from '../components/pagination/Pagination' // PaginationNew to be finalized

const ShopCategory = (props) => {

    const { all_products } = useContext(ShopContext)
    const { searchResults } = useContext(SearchContext);

    let products;
    if (props.category === 'search') {
        products = searchResults;
    } else {
        // Filter the products based on the category
        products = all_products.filter(item => item.category === props.category);
    }

    const PRODUCTS_PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    const [sortOption, setSortOption] = useState('default');

    const sortOptions = {
        default: (a, b) => a.id - b.id,
        priceAscending: (a, b) => parseFloat(a.price) - parseFloat(b.price),
        priceDescending: (a, b) => parseFloat(b.price) - parseFloat(a.price),

        // same as default
        newest: (a, b) => a.id - b.id,
        bestSelling: (a, b) => a.id - b.id,
        rating: (a, b) => a.id - b.id,

        nameAscending: (a, b) => a.name.localeCompare(b.name),
        nameDescending: (a, b) => b.name.localeCompare(a.name),
    }
    products.sort(sortOptions[sortOption]);
    // end of sorting implementation

    const currentProducts = products.slice(startIndex, endIndex);

    // Retrieve the exchange rate date
    const [exchangeRateDate, setExchangeRateDate] = useState('');

    useEffect(() => {
        const storedDate = localStorage.getItem('exchangeRatesDate');
        if (storedDate) {
            // Convert the stored date to a local date and time
            const localDate = new Date(storedDate).toLocaleString();
            setExchangeRateDate(localDate);
        }
    }, []);

    return (
        <div className='shop-category'>
            <PaginationNew fallbackPerPage={PRODUCTS_PER_PAGE} currentPage={currentPage} onPageChange={setCurrentPage}
                           totalPages={totalPages}/>
            <img className='shop-category-banner' src={props.banner} alt=""/>
            <div className="shop-category-title-sort">
                <div className="shop-category-title">
                    <p>{props.title}</p>
                </div>
                <div className="shop-category-sort">
                    <label className='shop-category-grid-sort'>Sort:</label>
                    <select
                        className='shop-category-grid-sort-select'
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
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
                <div className="exchange-rate-reminder">
                    <p>Exchange rate last updated: {exchangeRateDate}</p>
                </div>
            </div>

            <div className={`shop-category-products${currentProducts.length === 0 ? '-empty' : ''}`}>
                {currentProducts.length > 0 ? (
                    currentProducts.map((item, i) => (
                        <Item
                            key={i}
                            id={item.id}
                            image={item.image}
                            brand={item.brand}
                            name={item.name}
                            price={item.price}
                        />
                    ))
                ) : (
                    <p className="shop-category-products-msg">
                        No products can be displayed in this page. Check another
                        category.
                    </p>
                )}
            </div>

            {/* employ a nav for pagination. created in the future */}
            <PaginationNew fallbackPerPage={PRODUCTS_PER_PAGE} currentPage={currentPage} onPageChange={setCurrentPage}
                           totalPages={totalPages}/>
        </div>
    )
}

export default ShopCategory