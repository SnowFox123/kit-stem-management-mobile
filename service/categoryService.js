import { axiosInstance } from "./customize-axios";

export const getAllCategories = async () => {
	try {
		const response = await axiosInstance.post('/client/category/search', {
			searchCondition: {
				keyword: "",
				is_deleted: false
			},
			pageInfo: {
				pageNum: 1,
				pageSize: 1000
			}
		});

		console.log('====================================');
		console.log("category", response);
		console.log('====================================');

		return response.data.pageData;
	} catch (error) {
		console.log(error);

	}
}