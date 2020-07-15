# randomly-generated string --> user string
# Example: 'djfoefjwodm' --> 'hello world'

import random
from math import exp

alphabet = {
        1: 'a', 2: 'A',
        3: 'b', 4: 'B',
        5: 'c', 6: 'C',
        7: 'd', 8: 'D',
        9: 'e', 10: 'E',
        11: 'f', 12: 'F',
        13: 'g', 14: 'G',
        15: 'h', 16: 'H',
        17: 'i', 18: 'I',
        19: 'j', 20: 'J',
        21: 'k', 22: 'K',
        23: 'l', 24: 'L',
        25: 'm', 26: 'M',
        27: 'n', 28: 'N',
        29: 'o', 30: 'O',
        31: 'p', 32: 'P',
        33: 'q', 34: 'Q',
        35: 'r', 36: 'R',
        37: 's', 38: 'S',
        39: 't', 40: 'T',
        41: 'u', 42: 'U',
        43: 'v', 44: 'V',
        45: 'w', 46: 'W',
        47: 'x', 48: 'X',
        49: 'y', 50: 'Y',
        51: 'z', 52: 'Z',
        53: ' ', 54: '.',
        55: ',', 56: '!',
        57: '?', 58: '-',
        }

MIN = list(alphabet.keys())[0]
MAX = list(alphabet.keys())[-1]

random.seed(42)

class Agent:

    def __init__(self):
        self.initial_state = []
        self.goal_state = []
        self.goal_state_encoding = []

    def initialise(self):
        random_string = random.choices(list(alphabet.values()), k=len(self.goal_state))
        self.initial_state = random_string
        return self.initial_state

    def set_goal(self, goal_state):
        self.goal_state = goal_state
        self.goal_state_encoding = [self.letter_to_int(s) for s in goal_state]
        return self.goal_state

    def get_successors(self, state):
        successors = []
        int_encoding = [self.letter_to_int(letter) for letter in self.initial_state]
        for i in range(len(int_encoding)):
            for j in range(MIN, MAX):
                if int_encoding[i] != j:
                    successor = state.copy()
                    successor[i] = self.int_to_letter(j)
                    successors.append(successor)
        return successors

    def fitness(self, state):
        state_encoding = [self.letter_to_int(s) for s in state]
        fitness_score = 0
        for idx, e in enumerate(state_encoding):
            fitness_score += abs(self.goal_state_encoding[idx] - e)
        return fitness_score

    def letter_to_int(self, letter):
        return [i for i, l in alphabet.items() if l == letter][0]
    
    def int_to_letter(self, integer):
        return alphabet[integer]

class Node:
    def __init__(self, state, parent_one, parent_two, mutated, value):
        self.state = state
        self.parent_one = parent_one
        self.parent_two = parent_two
        self.mutated = mutated
        self.value = value

def genetic_algorithm(population, fitness):
    num_letters = 25
    size_of_individual = len(population[0])
    step = 0
    step_limit = 500
    epsilon = 0.1

    def compute_weights(population):
        fitness_scores = [fitness(p) for p in population]
        softmax = [exp(num_letters * size_of_individual - f) for f in fitness_scores]
        weights = [s/sum(softmax) for s in softmax]
        return weights

    def reproduce(x, y):
        split_point_one = random.randint(0, len(x) - 2)
        split_point_two = random.randint(split_point_one, len(x) - 1)
        return x[:split_point_one] + y[split_point_one:split_point_two] + x[split_point_two:]

    def mutate(x):
        random_int = random.randint(0, len(x) - 1)
        x_copy = x.copy()
        x_copy[random_int] = alphabet[random.randint(MIN, MAX)]
        return x_copy

    population_history = [[Node(p, [], [], [p, p], fitness(p)) for p in population]]
    population_fitness = [fitness(p) for p in population]

    while 0 not in population_fitness and step < step_limit:
        if step % 1 == 0:
            print("Generation {} --> {} ({})".format(step, ''.join(population[0]), fitness(population[0])))
        new_population = []
        new_population_history = []
        weights = compute_weights(population)
        for _ in range(len(population)):
            random_float = random.uniform(0.01, 0.99)
            x = random.choices(population, weights=[random_float*w for w in weights], k=1)[0]
            random_float = random.uniform(0.01, 0.99)
            y = random.choices(population, weights=[random_float*w for w in weights], k=1)[0]
            child = reproduce(x, y)
            random_float = random.uniform(0, 1)
            mutated = random_float < epsilon
            mutated_child = child
            if mutated:
                mutated_child = mutate(child)
            new_population.append(mutated_child)
            new_population_history.append(Node(mutated_child, x, y, [child, mutated_child], fitness(mutated_child)))
        population = new_population
        population_history.append(new_population_history)
        population_fitness = [fitness(p) for p in population]
        step += 1

    solution_generation = population_history[-1].copy()
    solution_generation.sort(key=lambda node: fitness(node.state))
    solution = solution_generation[0]
    print("Generation {} --> {} ({})".format(step, ''.join(solution.state), solution.value))
    return solution, step, population_history

# user = input("\n\nEnter word: ")
user = 'grace low?'

agent = Agent()
agent.set_goal(list(user))
agent.initialise()

successors = agent.get_successors(agent.initial_state)
print("Running genetic algorithm...")
solution, step_count, history = genetic_algorithm(successors, agent.fitness)
print("Solution found in generation {}: {} ({})".format(step_count, ''.join(solution.state), solution.value))
print("Immediate parents: {} and {}".format(''.join(solution.parent_one), ''.join(solution.parent_two)))

# generation = history[10].copy()
# generation.sort(key=lambda p : p.value)
# for node in generation:
#     print('{} + {} ==> {} (f:{} | m:{}/{})'.format(
#         ''.join(node.parent_one),
#         ''.join(node.parent_two),
#         ''.join(node.state),
#         node.value,
#         ''.join(node.mutated[0]),
#         ''.join(node.mutated[1]),
#     ))