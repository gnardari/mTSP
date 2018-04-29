#!/usr/bin/env python
import asyncio
import datetime
import random
import websockets
import numpy as np
import time
import json

IP = 'localhost'
PORT = 5678


def read_config_tsplib(f_name='../benchmarks/eil51.tsp'):
    info = {}
    cities = []
    with open(f_name) as f:
        for i in range(5):
            line = f.readline().split(':')
            info[line[0].strip().lower()] = line[1].strip()
        f.readline()

        for i in range(int(info['dimension'])):
            line = f.readline().split(' ')
            cities.append({'x': int(line[1])*5,
                           'y': int(line[2])*5,
                           'isDepot': False,
                           'idx': int(line[0])-1})
    return {'info': info, 'cities': cities}

async def random_solution(data):
    '''
    Simulates a metaheuristic algorithm and returns a random solution
    '''
    solution = {'cost': 8000}
    rand_paths = [i for i in range(len(data['cities']))]
    np.random.shuffle(rand_paths)

    smanA = rand_paths[:20]
    smanA.append(smanA[0])

    smanB = rand_paths[20:]
    smanB.append(smanB[0])

    solution['paths'] = [smanA, smanB]
    time.sleep(random.random() * 3)
    return solution


data = read_config_tsplib()
async def sendSolution(websocket, path):
    while True:
        data['solution'] = await random_solution(data)
        await websocket.send(json.dumps(data))

start_server = websockets.serve(sendSolution, IP, PORT)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
