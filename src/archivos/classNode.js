class TreeNode {
    constructor(id, size) {
        this.id = id;
        this.size = size;
        this.children = [];
    }
  }
  
export  function convertToHierarchy(lista, name) {
    const root = new TreeNode(name, null);
    
    lista.forEach(item => {
  
        const classes = item.id.split(".");
        let currentNode = root;
        
        classes.forEach(className => {
            let childNode = currentNode.children.find(child => child.id === className);
            if (!childNode) {
                childNode = new TreeNode(className, null);
                currentNode.children.push(childNode);
            }
            currentNode = childNode;
        });
        
        currentNode.size = item.size;
    });
    
    return root;
  }