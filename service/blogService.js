import { axiosInstance } from "./customize-axios";

export const getBlogs = async () => {
	try {
		const response = await axiosInstance.post('/client/blog/search', {
			searchCondition: {
				category_id: "",
				is_deleted: false
			},
			pageInfo: {
				pageNum: 1,
				pageSize: 100
			}
		});

		return response;

	} catch (error) {
		console.log('====================================');
		console.log(error);
		console.log('====================================');
	}
}