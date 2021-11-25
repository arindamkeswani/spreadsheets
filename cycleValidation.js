let collectedGraphComponent = []

//storage-> 2D Matrix (Basic requirement). When we put child it will turn into 3D matrix
let graphComponentMatrix = [];

// //Get 2D representation (100x26)
// for (let i = 0; i < rows; i++) {
//     let row = []
//     for (let j = 0; j < column; j++) {
//         //cell properties. Similar to how we put object, now we put array
//         //Pushing array here because of "Can have more than 1 child relation (dependency)"
//         row.push([])
//     }

//     //this will push all 100 rows
//     graphComponentMatrix.push(row)
// }

//True-> Cyclic , False-> Not cyclic
function isGraphCyclic(graphComponentMatrix) {
    // Output dependency-> visited, DFS visited (2D array)
    let visited = []
    let dfsVisited = []

    for (let i = 0; i < rows; i++) {
        let visitedRow = []
        let dfsVisitedRow = []
        for (let j = 0; j < column; j++) {

            visitedRow.push(false)
            dfsVisitedRow.push(false)
        }
        visited.push(visitedRow)
        dfsVisited.push(dfsVisitedRow)
    }

    //Loop is run on all nodes to test all components of the graph
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < column; j++) {
            if (visited[i][j] == false) {
                let res = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if (res === true) {
                    return [i,j]; //cycle found
                }
            }
        }
    }

    return null;
}

//Start-> vis(True) dfs(vis) = true
//End-> dfsVis = false
//if visited[i][j]=true, already explored, no need to see again
//Cycle detection comdn-> if (vis[i][j]==true && dfsVis[i][j] == true) -> cycle

//Return boolean
function dfsCycleDetection(graphComponentMatrix, sr, sc, visited, dfsVisited) {
    visited[sr][sc] = true;
    dfsVisited[sr][sc] = true;

    //traverse through children
    for (let child = 0; child < graphComponentMatrix[sr][sc].length; child++) {
        let [nr, nc] = graphComponentMatrix[sr][sc][child]
        if (visited[nr][nc] === false) {
            let res = dfsCycleDetection(graphComponentMatrix, nr, nc, visited, dfsVisited)
            if (res === true) {
                return true; //found cycle so return immediately
            }
        }
        else if (visited[nr][nc] === true && dfsVisited[nr][nc] === true) { //found cycle
            return true;
        }
    }


    dfsVisited[sr][sc] = false;
    return false;
}