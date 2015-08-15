package hub

import (
	"os"

	"github.com/streadway/amqp"
)

type Stream struct {
	AmqpUri   string `json:"amqp_uri"`
	QueueName string `json:"queue_name"`
}

func (s *Stream) Consume() error {
	conn, err := amqp.Dial(s.AmqpUri)
	defer conn.Close()

	if err != nil {
		return err
	}

	channel, err := conn.Channel()
	defer channel.Close()

	if err != nil {
		return err
	}

	q, err := channel.QueueDeclare(
		s.QueueName, // name
		false,       // durable
		true,        // delete when unused
		false,       // exclusive
		false,       // no-wait
		nil,         // arguments
	)

	if err != nil {
		return err
	}

	msgs, err := channel.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)

	if err != nil {
		return err
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			os.Stdout.Write(d.Body)
		}
	}()

	<-forever

	return nil
}
