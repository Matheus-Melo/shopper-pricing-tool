'use client'

import { useProductData } from '@/contexts/DataContext'
import './home.css'
import FileUpload from '@/components/local/FileUpload'
import ProductList from '@/components/local/ProductList'

export default function Home() {
	return (
		<main className="h-screen ">
			<FileUpload />
			<ProductList />
		</main>
	)
}
