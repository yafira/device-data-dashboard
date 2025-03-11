// MQTTComponent.js
import { useState, useEffect } from 'react'
import mqtt from 'mqtt'

const MQTTComponent = () => {
	const [message, setMessage] = useState(null)
	const [isConnected, setIsConnected] = useState(false)
	const [client, setClient] = useState(null)

	// MQTT broker settings
	const brokerUrl = 'wss://tigoe.net/mqtt' // WebSocket connection (for browser)
	const username = 'conndev' // shiftr.io username
	const password = 'b4s1l!' // shiftr.io password
	const clientId = `mqtt-client-${Math.floor(Math.random() * 10000)}` // unique client ID

	// function to handle MQTT connection and subscription
	useEffect(() => {
		const mqttClient = mqtt.connect(brokerUrl, {
			clientId,
			username,
			password,
		})

		mqttClient.on('connect', () => {
			console.log('Connected to MQTT broker')
			setIsConnected(true)
			mqttClient.subscribe('your/topic', (err) => {
				if (err) {
					console.log('Subscription error:', err)
				} else {
					console.log('Subscribed to topic')
				}
			})
		})

		mqttClient.on('message', (topic, payload) => {
			const message = payload.toString()
			console.log(`Received message: ${message} on topic: ${topic}`)
			setMessage(message)
		})

		mqttClient.on('error', (err) => {
			console.error('MQTT Error:', err)
			setIsConnected(false)
		})

		// store the client in the state
		setClient(mqttClient)

		// cleanup the MQTT connection on component unmount
		return () => {
			if (mqttClient && mqttClient.connected) {
				mqttClient.end()
			}
		}
	}, [clientId])

	// function to disconnect the MQTT client manually
	const handleDisconnect = () => {
		if (client) {
			client.end() // disconnect from the broker
			setIsConnected(false)
		}
	}

	return (
		<div>
			<h1>MQTT Client</h1>
			<p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
			{message && <p>Received Message: {message}</p>}
			<button onClick={handleDisconnect} disabled={!isConnected}>
				Disconnect
			</button>
		</div>
	)
}

export default MQTTComponent
