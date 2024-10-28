const BASE_URL = import.meta.env.VITE_API_URL

export const classPeriodService = {

    getClassPeriods: async (token) => {
        const response = await fetch(`${BASE_URL}/class-period/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }

        const data = await response.json()

        return data
    }
}
