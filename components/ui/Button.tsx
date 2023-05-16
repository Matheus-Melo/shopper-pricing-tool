import { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode
	intent?: 'default' | 'CTA'
}

export function Button({
	children,
	intent = 'default',
	...props
}: ButtonProps) {
	return (
		<button
			className=" bg-cyan-800 py-3 px-4 transition focus-within:ring-2 ring-cyan-50 hover:bg-cyan-600 disabled:bg-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed"
			{...props}
		>
			{children}
		</button>
	)
}
