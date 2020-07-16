import { v4 as uuid } from 'uuid';

export const alphabet = {
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

const alphabet_keys = Object.keys(alphabet)

export const alphabet_max = alphabet_keys[alphabet_keys.length - 1]
export const alphabet_min = alphabet_keys[0]

export class Agent {

    set_goal = goal_state => {
        this.goal_state = goal_state.split('');
        this.goal_state_encoding = this.goal_state.map(letter => this.letter_to_int(letter))
        const random_ints = []
        for (let i = 0; i < this.goal_state.length; i++) {
            random_ints.push(Math.floor(Math.random() * (alphabet_max - alphabet_min + 1) + 1))
        }
        this.initial_state_encoding = [...random_ints];
        this.initial_state = this.initial_state_encoding.map(integer => this.int_to_letter(integer));

        return this.goal_state
    }

    get_successors = state => {
        const successors = []
        for (let i = 0; i < state.length; i++) {
            for (let j = alphabet_min; j < alphabet_max; j++) {
                if (state[i] !== j) {
                    const successor = [...state];
                    successor[i] = this.int_to_letter(j);
                    successors.push(successor)
                }
            }
        }
        return successors
    }

    fitness = state => {
        const int_encoding = state.map(letter => this.letter_to_int(letter));
        let fitness_score = 0;
        for (let i = 0; i < int_encoding.length; i++) {
            fitness_score += Math.abs(this.goal_state_encoding[i] - int_encoding[i]);
        }
        return fitness_score
    }

    letter_to_int = letter => {
        for (let key in alphabet) {
            if (alphabet[key] === letter) return key
        }
    }

    int_to_letter = int => alphabet[int]
}

export class Node {
    constructor(state, parent_one, parent_two, parent_split_point, is_mutated, value) {
        this.id = uuid()
        this.state = state
        this.parent_one = parent_one
        this.parent_two = parent_two
        this.parent_split_point = parent_split_point
        this.is_mutated = is_mutated
        this.value = value
    }
}

export const genetic_algorithm = (population, fitness, step_limit=10) => {

    const select_parents = population_nodes => {
        const worst_fitness_score = (alphabet_max - alphabet_min) * population_nodes[0].state.length;
        const fitness_scores = population_nodes.map(node => node.value);
        const softmax_scores = fitness_scores.map(f => Math.exp(worst_fitness_score - f));
        const softmax_sum = softmax_scores.reduce((a, b) => a + b, 0);
        const weights = softmax_scores.map(s => s/softmax_sum);
        const cum_weights = [];
        let running_total = 0;
        for (let i = 0; i < weights.length; i++) {
            running_total += weights[i];
            cum_weights.push(running_total);
        }
        const random_float_one = Math.random();
        const parent_one_index = cum_weights.findIndex(w => random_float_one < w);
        const random_float_two = Math.random();
        const parent_two_index = cum_weights.findIndex(w => random_float_two < w);

        return [population_nodes[parent_one_index], population_nodes[parent_two_index]];
    }

    const reproduce = parent_nodes => {
        const parent_state_one = parent_nodes[0].state;
        const parent_state_two = parent_nodes[1].state; 
        const split_point = Math.floor(Math.random() * parent_state_one.length);
        const child_state = parent_state_one.slice(0,split_point).concat(parent_state_two.slice(split_point));
        return new Node(child_state, parent_nodes[0], parent_nodes[1], split_point, false, fitness(child_state))
    }

    const mutate = node => {
        const node_state = [...node.state];
        const random_int = Math.floor(Math.random() * node_state.length);
        const random_letter = alphabet[Math.ceil(Math.random() * alphabet_max)];
        node_state[random_int] = random_letter
        return new Node(node_state, node.parent_one, node.parent_two, node.parent_split_point, true, fitness(node_state))
    }


    let step = 0;
    const mutation_epsilon = 0.1;

    let population_nodes = population.map(p => new Node(p, null, null, null, false, fitness(p)));
    let population_fitness = population_nodes.map(p => p.value);
    const population_history = [population_nodes];

    while (!population_fitness.includes(0) && (step < step_limit)) {

        if (step % 1 === 0) console.log(`Generation ${step} --> ${population_nodes[0].state} (${population_nodes[0].value})`);

        let next_population_nodes = []

        for (let i = 0; i < population_nodes.length; i++) {
            let parent_nodes = select_parents(population_nodes);
            let child_node = reproduce(parent_nodes);
            let mutation = Math.random();
            if (mutation < mutation_epsilon) {
                child_node = mutate(child_node);    
            }
            next_population_nodes.push(child_node);
        }

        population_nodes = next_population_nodes;
        population_fitness = population_nodes.map(p => p.value);
        population_history.push(population_nodes);

        step += 1;
    }

    population_nodes.sort((a, b) => a.value - b.value)
    const solution_node = population_nodes[0]

    return {
        solution: solution_node,
        step: step,
        history: population_history
    }

} 

export const get_ancestors = youngest_node => {
    const recurse = node => {
        if (!node.parent_one) {
            return []
        } else {
            return [node.parent_one, node.parent_two].concat(recurse(node.parent_one)).concat(recurse(node.parent_two));
        }
    }
    return recurse(youngest_node)
}

export const get_tree_repr = (node, limit) => {
    if (!node.parent_one || !limit) {
        return { 
            id: node.id,
            name: `${node.state.join('')} (${node.value})`
        }
    } else {
        return {
        id: node.id,
        name: `${node.state.join('')} (${node.value})`,
        children: [node.parent_one, node.parent_two].map(n => get_tree_repr(n, limit - 1))
        }
    }
}