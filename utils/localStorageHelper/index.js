
export function getUserFromLocalStorage() {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : "";
    return user;
}
