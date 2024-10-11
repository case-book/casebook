package com.mindplates.bugcase.biz.sequence.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

public class DirectedGraph {

    private final Map<Long, Node> nodes = new HashMap<>();
    private final Map<Long, Set<Long>> backwardConnections = new HashMap<>();
    private Map<Long, Set<Long>> forwardConnections = new HashMap<>();

    public String addNode(Long id) {
        if (!nodes.containsKey(id)) {
            nodes.put(id, new Node(id));
            return "Node added: " + id;
        }
        return "Node already exists: " + id;
    }

    public void addEdge(Long fromId, Long toId) {
        forwardConnections.computeIfAbsent(fromId, k -> new HashSet<>()).add(toId);
        backwardConnections.computeIfAbsent(toId, k -> new HashSet<>()).add(fromId);
    }


    public List<Long> findPath(String fromId, String toId) {
        if (nodes.containsKey(fromId) && nodes.containsKey(toId)) {
            return bfs(nodes.get(fromId), nodes.get(toId));
        }
        return Collections.emptyList();
    }

    public Set<Long> getConnectedNodes(Long id) {
        Set<Long> connectedNodes = new HashSet<>();
        Set<Long> visited = new HashSet<>();
        Queue<Long> queue = new LinkedList<>();

        queue.offer(id);
        visited.add(id);

        while (!queue.isEmpty()) {
            Long currentId = queue.poll();

            // 앞으로 연결된 노드 탐색
            Set<Long> forwardNodes = forwardConnections.getOrDefault(currentId, Collections.emptySet());
            for (Long nextId : forwardNodes) {
                if (!visited.contains(nextId)) {
                    visited.add(nextId);
                    queue.offer(nextId);
                    connectedNodes.add(nextId);
                }
            }

            // 뒤로 연결된 노드 탐색
            Set<Long> backwardNodes = backwardConnections.getOrDefault(currentId, Collections.emptySet());
            for (Long prevId : backwardNodes) {
                if (!visited.contains(prevId)) {
                    visited.add(prevId);
                    queue.offer(prevId);
                    connectedNodes.add(prevId);
                }
            }
        }

        return connectedNodes;
    }


    private List<Long> bfs(Node start, Node end) {
        Queue<Node> queue = new LinkedList<>();
        Map<Node, Node> parentMap = new HashMap<>();
        Set<Node> visited = new HashSet<>();

        queue.offer(start);
        visited.add(start);

        while (!queue.isEmpty()) {
            Node current = queue.poll();
            if (current == end) {
                return reconstructPath(parentMap, end);
            }

            for (Node connection : current.getConnections()) {
                if (!visited.contains(connection)) {
                    visited.add(connection);
                    parentMap.put(connection, current);
                    queue.offer(connection);
                }
            }
        }

        return Collections.emptyList();
    }

    private List<Long> reconstructPath(Map<Node, Node> parentMap, Node end) {
        List<Long> path = new ArrayList<>();
        Node current = end;
        while (current != null) {
            path.add(0, current.getId());
            current = parentMap.get(current);
        }
        return path;
    }

    public boolean nodeExists(Long id) {
        return forwardConnections.containsKey(id) || backwardConnections.containsKey(id);
    }

    private static class Node {

        private final Long id;
        private final Set<Node> connections;

        public Node(Long id) {
            this.id = id;
            this.connections = new HashSet<>();
        }

        public Long getId() {
            return id;
        }

        public Set<Node> getConnections() {
            return connections;
        }

        public void addConnection(Node node) {
            connections.add(node);
        }
    }
}
