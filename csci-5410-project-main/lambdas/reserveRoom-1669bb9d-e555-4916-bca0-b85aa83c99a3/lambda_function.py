import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
rooms_table = dynamodb.Table('Rooms')
reservations_table = dynamodb.Table('Reservations')

def lambda_handler(event, context):
    user_id = event['user_id']
    room_id = event['room_id']
    start_date = event['start_date']
    end_date = event['end_date']
    
    reservation_id = str(uuid.uuid4())
    
    reservations_table.put_item(
        Item={
            'reservation_id': reservation_id,
            'user_id': user_id,
            'room_id': room_id,
            'start_date': start_date,
            'end_date': end_date
        }
    )
    
    return {
        'statusCode': 201,
        'body': json.dumps({'reservation_id': reservation_id}),
        'headers': {
            'Content-Type': 'application/json'
        }
    }
