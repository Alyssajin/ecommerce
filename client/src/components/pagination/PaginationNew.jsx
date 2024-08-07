import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate} from 'react-router-dom';
import "./Pagination.css"



const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5; // Number of page numbers to show
    const halfPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

    let startPage = Math.max(1, currentPage - halfPageNumbersToShow);
    let endPage = Math.min(totalPages, currentPage + halfPageNumbersToShow);

    if (currentPage <= halfPageNumbersToShow) {
        endPage = Math.min(totalPages, maxPageNumbersToShow);
    }

    if (currentPage + halfPageNumbersToShow >= totalPages) {
        startPage = Math.max(1, totalPages - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
            >
                {'<<'}
            </button>

            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                {'<'}
            </button>

            {pageNumbers.map((number) => (
                <button
                    key={number}
                    className={number === currentPage ? 'active-page' : 'inactive-page'}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                {'>'}
            </button>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
            >
                {'>>'}
            </button>
        </div>
    );
};

export default Pagination;