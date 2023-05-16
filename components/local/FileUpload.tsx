'use client'

import { useRef } from 'react'
import Papa from 'papaparse'
import { Button } from '../ui/Button'
import { ProductData, useProductData } from '@/contexts/DataContext'

export default function FileUpload() {
	const { setProductData, readyToUpdate, productData } = useProductData()

	const inputRef = useRef<HTMLInputElement>(null)

	const handleUploadCSV = () => {
		const input = inputRef.current

		if (input?.files?.length) {
			const file: File = input.files[0]

			const reader = new FileReader()

			reader.onloadend = async ({ target }) => {
				if (target && target.result) {
					const csv = Papa.parse(target.result.toString(), { header: true })

					const res = await fetch('http://localhost:3000/api/upload', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							csv_data: csv?.data
						}),
						cache: 'no-store'
					})

					const result = (await res.json()) as ProductData[]
					console.log('result:', result)
					setProductData(result)
				}
			}

			reader.readAsText(file)
		}
	}

	const handleUpdateData = async () => {
		const res = await fetch('http://localhost:3000/api/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data: productData })
		})

		const result = await res.json()

		console.log(result)
	}

	return (
		<div className="flex flex-col w-fit h-full justify-center m-auto gap-4">
			<h1 className="font-bold text-xl">Upload CSV file</h1>
			<label className="block cursor-pointer text-center bg-cyan-800 py-3 px-4 rounded transition focus-within:ring-2 ring-cyan-50 hover:bg-cyan-600">
				Choose File
				<input ref={inputRef} type="file" />
			</label>
			<div className="flex flex-row w-full">
				<Button onClick={handleUploadCSV}>Validate</Button>
				<Button onClick={handleUpdateData} disabled={!readyToUpdate}>
					Update
				</Button>
			</div>
		</div>
	)
}
