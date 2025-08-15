import { useEffect, useState } from 'react'
import './App.css'

type Customer = {
	id: string
	name: string
	rncCedula: string
	email?: string
	phone?: string
	riskLevel: string
	creditLimit: string
	creditScore: number
}

type Invoice = {
	id: string
	issueDate: string
	dueDate: string
	total: string
	balance: string
	status: string
	ncfNumber?: string
	customer: Customer
}

type Summary = { moneda: string; totalPorCobrar: string; montoVencido: string }

const API = (path: string) => `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api${path}`

function useFetch<T>(path: string) {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	useEffect(() => {
		let alive = true
		setLoading(true)
		fetch(API(path))
			.then((r) => r.json())
			.then((d) => {
				if (alive) setData(d)
			})
			.catch((e) => setError(String(e)))
			.finally(() => setLoading(false))
		return () => {
			alive = false
		}
	}, [path])
	return { data, loading, error }
}

export default function App() {
	const [tab, setTab] = useState<'resumen' | 'clientes' | 'facturas' | 'pagos'>('resumen')
	const { data: resumen } = useFetch<Summary>('/reports/dashboards/summary')
	const { data: clientes } = useFetch<Customer[]>('/customers')
	const { data: facturas } = useFetch<Invoice[]>('/invoices')

	return (
		<div className="container">
			<h1>Gestión de Deudas - es-DO (DOP)</h1>
			<nav className="tabs">
				<button onClick={() => setTab('resumen')} className={tab === 'resumen' ? 'active' : ''}>
					Resumen
				</button>
				<button onClick={() => setTab('clientes')} className={tab === 'clientes' ? 'active' : ''}>
					Clientes
				</button>
				<button onClick={() => setTab('facturas')} className={tab === 'facturas' ? 'active' : ''}>
					Facturas
				</button>
				<button onClick={() => setTab('pagos')} className={tab === 'pagos' ? 'active' : ''}>
					Pagos
				</button>
			</nav>

			{tab === 'resumen' && (
				<section>
					<h2>Resumen</h2>
					<p>
						Total por cobrar: <strong>{resumen?.moneda} {resumen?.totalPorCobrar}</strong>
					</p>
					<p>
						Monto vencido: <strong>{resumen?.moneda} {resumen?.montoVencido}</strong>
					</p>
				</section>
			)}

			{tab === 'clientes' && (
				<section>
					<h2>Clientes</h2>
					<table>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>RNC/Cédula</th>
								<th>Riesgo</th>
								<th>Límite</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							{clientes?.map((c) => (
								<tr key={c.id}>
									<td>{c.name}</td>
									<td>{c.rncCedula}</td>
									<td>{c.riskLevel}</td>
									<td>{c.creditLimit}</td>
									<td>{c.creditScore}</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			)}

			{tab === 'facturas' && (
				<section>
					<h2>Facturas</h2>
					<table>
						<thead>
							<tr>
								<th>Cliente</th>
								<th>Emisión</th>
								<th>Vence</th>
								<th>Total</th>
								<th>Saldo</th>
								<th>Estado</th>
							</tr>
						</thead>
						<tbody>
							{facturas?.map((f) => (
								<tr key={f.id}>
									<td>{f.customer?.name}</td>
									<td>{f.issueDate}</td>
									<td>{f.dueDate}</td>
									<td>{f.total}</td>
									<td>{f.balance}</td>
									<td>{f.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			)}

			{tab === 'pagos' && (
				<section>
					<h2>Pagos</h2>
					<p>Use la API POST /api/payments para registrar pagos.</p>
				</section>
			)}
		</div>
	)
}
