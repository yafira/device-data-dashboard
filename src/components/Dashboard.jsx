import { useState } from 'react'
import ChartComponent from './Chart'
import SensorDataHandler from './SensorDataHandler'

const Dashboard = () => {
	const [data, setData] = useState({
		temperature: '--',
		humidity: '--',
		pressure: '--',
		gas: '--',
		chartData: {
			temperature: [],
			humidity: [],
			pressure: [],
			gas: [],
		},
		stats: {
			temperature: { max: '--', min: '--', avg: '--' },
			humidity: { max: '--', min: '--', avg: '--' },
			pressure: { max: '--', min: '--', avg: '--' },
			gas: { max: '--', min: '--', avg: '--' },
		},
	})

	// Convert temperature to Fahrenheit
	const convertToFahrenheit = (celsius) => {
		if (celsius === '--') return '--'
		return ((parseFloat(celsius) * 9) / 5 + 32).toFixed(2)
	}

	return (
		<div className='dashboard'>
			<div className='dashboard-header'>
				<h1>BME680 Sensor Dashboard</h1>
			</div>
			<div className='cards-container'>
				{/* Current Readings */}
				<div className='card'>
					<div className='card-header'>Current Readings</div>
					<div className='readings-grid'>
						<div className='reading-item'>
							<span>Temperature</span>
							<span>
								{data.temperature}°C / {convertToFahrenheit(data.temperature)}°F
							</span>
						</div>
						<div className='reading-item'>
							<span>Humidity</span>
							<span>{data.humidity}%</span>
						</div>
						<div className='reading-item'>
							<span>Pressure</span>
							<span>{data.pressure} hPa</span>
						</div>
						<div className='reading-item'>
							<span>Gas</span>
							<span>{data.gas} Ω</span>
						</div>
					</div>
				</div>

				{/* Statistics */}
				<div className='card'>
					<div className='card-header'>Statistics</div>
					<div className='stats-container'>
						{/* Temperature Stats */}
						<div className='stat-section'>
							<h3>Temperature</h3>
							<div className='stats-grid'>
								<div className='stat-item'>
									<span>Average</span>
									<span>
										{data.stats.temperature.avg}°C /{' '}
										{convertToFahrenheit(data.stats.temperature.avg)}°F
									</span>
								</div>
								<div className='stat-item'>
									<span>Maximum</span>
									<span>
										{data.stats.temperature.max}°C /{' '}
										{convertToFahrenheit(data.stats.temperature.max)}°F
									</span>
								</div>
								<div className='stat-item'>
									<span>Minimum</span>
									<span>
										{data.stats.temperature.min}°C /{' '}
										{convertToFahrenheit(data.stats.temperature.min)}°F
									</span>
								</div>
							</div>
						</div>

						{/* Humidity Stats */}
						<div className='stat-section'>
							<h3>Humidity</h3>
							<div className='stats-grid'>
								<div className='stat-item'>
									<span>Average</span>
									<span>{data.stats.humidity.avg}%</span>
								</div>
								<div className='stat-item'>
									<span>Maximum</span>
									<span>{data.stats.humidity.max}%</span>
								</div>
								<div className='stat-item'>
									<span>Minimum</span>
									<span>{data.stats.humidity.min}%</span>
								</div>
							</div>
						</div>

						{/* Pressure Stats */}
						<div className='stat-section'>
							<h3>Pressure</h3>
							<div className='stats-grid'>
								<div className='stat-item'>
									<span>Average</span>
									<span>{data.stats.pressure.avg} hPa</span>
								</div>
								<div className='stat-item'>
									<span>Maximum</span>
									<span>{data.stats.pressure.max} hPa</span>
								</div>
								<div className='stat-item'>
									<span>Minimum</span>
									<span>{data.stats.pressure.min} hPa</span>
								</div>
							</div>
						</div>

						{/* Gas Stats */}
						<div className='stat-section'>
							<h3>Gas</h3>
							<div className='stats-grid'>
								<div className='stat-item'>
									<span>Average</span>
									<span>{data.stats.gas.avg} Ω</span>
								</div>
								<div className='stat-item'>
									<span>Maximum</span>
									<span>{data.stats.gas.max} Ω</span>
								</div>
								<div className='stat-item'>
									<span>Minimum</span>
									<span>{data.stats.gas.min} Ω</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Chart component */}
			<ChartComponent data={data} />

			{/* Place SensorDataHandler at the bottom of the page */}
			<div
				className='footer-section'
				style={{
					marginTop: '20px',
					padding: '10px',
					borderTop: '1px solid #eee',
				}}
			>
				<SensorDataHandler setData={setData} />
			</div>
		</div>
	)
}

export default Dashboard
