package station

import (
	"github.com/streadway/amqp"
	"os"
	"fmt"
)

type Stream struct {
	AmqpUri   string `json:"Amqp"`
	QueueName string `json:"RoomID"`
}

func (s *Stream) Consume() error {
//	conn, err := amqp.Dial(s.AmqpUri)
	conn, err := amqp.Dial("amqp://ahmad:ahmad@192.168.4.79:32961/")
	defer conn.Close()

	if err != nil {
		fmt.Println("DialErr")
		return err
	}

	channel, err := conn.Channel()
	defer channel.Close()

	if err != nil {
		fmt.Println("ChannelERrr")
		return err
	}

	q, err := channel.QueueDeclare(
		s.QueueName, // name
		false,   // durable
		true,   // delete when unused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)

	if err != nil {
		fmt.Println("QueueDeclareErr")
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
		fmt.Println("ConsumeErr")
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