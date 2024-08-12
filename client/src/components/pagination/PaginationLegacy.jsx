import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate} from 'react-router-dom';


const PaginationLegacy = ({ fallbackPerPage, currentPage, onPageChange, totalPages }) => {

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

    // Update pagination state when query params change
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const page = parseInt(searchParams.get('page'), 10) || 1;
        const limit = parseInt(searchParams.get('limit'), 10) || fallbackPerPage;

        setPagination({
            pageIndex: page - 1,
            pageSize: limit,
        });

        onPageChange(page);
    }, [location.search, fallbackPerPage, onPageChange]);

    // Update query params when pagination state changes
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
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    )
}

export default PaginationLegacy