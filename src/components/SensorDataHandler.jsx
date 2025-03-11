import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import '../styles/SensorDataHandler.css'

const SensorDataHandler = ({ setData }) => {
	const [arduinoIP, setArduinoIP] = useState('192.168.1.167')
	const [connectionStatus, setConnectionStatus] = useState('Disconnected')
	const [lastUpdated, setLastUpdated] = useState(null)
	const intervalRef = useRef(null)
	const isFirstConnectionAttempt = useRef(true)
	const readings = useRef({
		temperature: [],
		humidity: [],
		pressure: [],
		gas: [],
		timestamps: [],
	})

	const fetchSensorData = async () => {
		try {
			// Direct connection to Arduino IP
			const apiUrl = `http://${arduinoIP}`
			console.log(`Fetching data from: ${apiUrl}`)

			const response = await fetch(apiUrl, {
				cache: 'no-cache',
				signal: AbortSignal.timeout(5000),
			})

			console.log('Response status:', response.status)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			// For debugging - log the raw response text first
			const responseText = await response.text()
			console.log('Raw response:', responseText)

			// Then parse it as JSON
			const sensorData = JSON.parse(responseText)
			console.log('Parsed sensor data:', sensorData)

			// Validate the received data - match Arduino's JSON field names
			if (
				typeof sensorData.temperature !== 'number' ||
				typeof sensorData.humidity !== 'number' ||
				typeof sensorData.pressure !== 'number' ||
				typeof sensorData.gasResistance !== 'number'
			) {
				throw new Error('Invalid sensor data format')
			}

			// Set to Connected only on first successful fetch
			if (connectionStatus !== 'Connected') {
				setConnectionStatus('Connected')
			}

			const timestamp = new Date()
			setLastUpdated(timestamp)

			// Update readings history with current timestamp
			readings.current.temperature.push(sensorData.temperature)
			readings.current.humidity.push(sensorData.humidity)
			readings.current.pressure.push(sensorData.pressure)
			readings.current.gas.push(sensorData.gasResistance * 1000) // Convert kΩ to Ω
			readings.current.timestamps.push(timestamp)

			// Keep last 100 readings for statistics and charts
			if (readings.current.temperature.length > 100) {
				readings.current.temperature.shift()
				readings.current.humidity.shift()
				readings.current.pressure.shift()
				readings.current.gas.shift()
				readings.current.timestamps.shift()
			}

			// Calculate statistics
			const calculateStats = (values) => ({
				max: Math.max(...values).toFixed(2),
				min: Math.min(...values).toFixed(2),
				avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
			})

			// Prepare chart data with timestamps
			const chartData = {
				temperature: readings.current.temperature.map((value, index) => ({
					x: readings.current.timestamps[index],
					y: value,
				})),
				humidity: readings.current.humidity.map((value, index) => ({
					x: readings.current.timestamps[index],
					y: value,
				})),
				pressure: readings.current.pressure.map((value, index) => ({
					x: readings.current.timestamps[index],
					y: value,
				})),
				gas: readings.current.gas.map((value, index) => ({
					x: readings.current.timestamps[index],
					y: value,
				})),
			}

			setData({
				temperature: sensorData.temperature.toFixed(2),
				humidity: sensorData.humidity.toFixed(2),
				pressure: sensorData.pressure.toFixed(2),
				gas: (sensorData.gasResistance * 1000).toFixed(2), // Convert kΩ to Ω
				chartData: chartData,
				stats: {
					temperature: calculateStats(readings.current.temperature),
					humidity: calculateStats(readings.current.humidity),
					pressure: calculateStats(readings.current.pressure),
					gas: calculateStats(readings.current.gas),
				},
			})

			// Not first attempt anymore
			isFirstConnectionAttempt.current = false
		} catch (error) {
			console.error('Error fetching sensor data:', error)

			// Only change to Disconnected if it's the first attempt
			if (isFirstConnectionAttempt.current) {
				setConnectionStatus('Disconnected')
				isFirstConnectionAttempt.current = false
			}
			// Maintain the same connection status if already connected
		}
	}

	// Function to handle connection
	const handleConnect = () => {
		// Clear existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
		}

		// Set to initial connecting state
		setConnectionStatus('Connecting...')

		// Reset first connection attempt flag
		isFirstConnectionAttempt.current = true

		// Fetch data immediately
		fetchSensorData()

		// Set up new polling interval
		intervalRef.current = setInterval(fetchSensorData, 2000)
	}

	useEffect(() => {
		// Clean up interval on component unmount
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, []) // Only run once on mount

	const getStatusColor = () => {
		if (connectionStatus === 'Connected') return 'status-connected'
		if (connectionStatus === 'Connecting...') return 'status-connecting'
		return 'status-disconnected'
	}

	return (
		<div className='sensor-status'>
			<div className='status-container'>
				<div>
					<span className={`status-indicator ${getStatusColor()}`}>
						Status: {connectionStatus}
					</span>
					{lastUpdated && (
						<span className='last-updated'>
							Last updated: {lastUpdated.toLocaleTimeString()}
						</span>
					)}
				</div>
			</div>

			<div className='ip-config'>
				<div className='ip-input-container'>
					<label htmlFor='arduino-ip'>Arduino IP:</label>
					<input
						id='arduino-ip'
						type='text'
						value={arduinoIP}
						onChange={(e) => setArduinoIP(e.target.value)}
					/>
				</div>

				<button onClick={handleConnect} className='connect-button'>
					Connect
				</button>
			</div>
		</div>
	)
}

SensorDataHandler.propTypes = {
	setData: PropTypes.func.isRequired,
}

export default SensorDataHandler
