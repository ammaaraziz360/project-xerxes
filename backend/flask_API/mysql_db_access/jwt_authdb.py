from mysql_db_access.mysql_creds import Credentials
from mysql_db_access.mysql_connection import CreateConnection


def createTokenRecord(jwt_data: dict):
    """
    Create a token record
    :return:
    """
    connex = CreateConnection(Credentials('blogoo-auth'))

    if connex != None:
        try:
            cursor = connex.cursor()
            cursor.callproc('insert_jwt_session',
                            [jwt_data['user_id'],
                            jwt_data['ip_address'],
                            jwt_data['user_agent'], 
                            jwt_data['createdAt'],
                            jwt_data['updatedAt']])
            connex.commit()
            connex.close() 
        except Exception as e:
            print(e)
            return(str(e))
    connex.close()   