'use client'

import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from 'react'

export interface ProductData {
	data: {
		product_code: number
		product_name?: string
		current_price: number
		new_price: number
	}
	broken_rules: string[]
}

type ProductDataContextType = {
	productData: ProductData[]
	setProductData: Dispatch<SetStateAction<ProductData[]>>
	readyToUpdate: boolean
}

const ProductDataContext = createContext({} as ProductDataContextType)

function ProductDataProvider({ children }: { children: ReactNode }) {
	const [productData, setProductData] = useState<ProductData[]>([])
	const [readyToUpdate, setReadyToUpdate] = useState(false)

	useEffect(() => {
		const condition =
			productData.length > 0 &&
			productData.every((product) => product.broken_rules.length === 0)
		setReadyToUpdate(condition)
	}, [productData])

	return (
		<ProductDataContext.Provider
			value={{ productData, setProductData, readyToUpdate }}
		>
			{children}
		</ProductDataContext.Provider>
	)
}

function useProductData() {
	const context = useContext(ProductDataContext)

	if (context === undefined) {
		throw new Error('useProductData must be used within a ProductDataProvider')
	}

	return context
}

export {
	ProductDataProvider as ProductDataProvider,
	useProductData as useProductData
}
