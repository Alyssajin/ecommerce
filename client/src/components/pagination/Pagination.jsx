import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


const Pagination = ({ fallbackPerPage, currentPage, onPageChange, totalPages }) => {

    const [pagination, setPagination] = useState({
        pageIndex: currentPage - 1,
        pageSize: fallbackPerPage,
    });

    const location = useLocation();
    const navigate = useNavigate();

    const createQueryString = useCallback(
        (params) => {
            const newSearchParams = new URLSearchParams(location.search);

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            }

            return newSearchParams.toString();
        },
        [location.search]
    );

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: currentPage - 1,
        }));
    }, [currentPage]);

    useEffect(() => {
        navigate({
            pathname: location.pathname,
            search: createQueryString({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
            }),
        });
        
        onPageChange(pagination.pageIndex + 1);
    }, [pagination.pageIndex, pagination.pageSize, createQueryString, location.pathname, navigate, onPageChange]);

    const handleNextPage = () => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex + 1,
        }));
    };

    const handlePrevPage = () => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: Math.max(prev.pageIndex - 1, 0),
        }));
    };


    return (
        <div className='pagination'>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    )
}

export default Pagination