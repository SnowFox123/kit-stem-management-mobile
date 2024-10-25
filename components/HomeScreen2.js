import React, { useEffect, useState } from 'react';
import { getLab } from '../service/UserServices'; // Ensure the path is correct

const HomeScreen2 = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const payload = {
        searchCondition: {
            keyword: "", // Add a search term if needed
            category_id: "", // Add a category ID if needed
            status: "",
            is_deleted: false
        },
        pageInfo: {
            pageNum: 1,
            pageSize: 10
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getLab(payload);

                console.log(result.data.pageData)
                setData(result.data.pageData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Lab Results</h1>
            {data.length > 0 ? (
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            {item.name} - {item.description} {/* Adjust based on your data structure */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default HomeScreen2;
