import time
DEPTH = 10

rows = [6,7,8,9,10,11,10,9,8,7,6]
givens = [[0 for _ in range(0, i)] for i in rows]
neighbors = [[[] for _ in range(0, i)] for i in rows]

def isInside(t):
  (i,j) = t
  if i < 0 or i > 10 or j < 0 or j >= rows[i]:
    return False
  return True

# initialize neighbors
for i in range(0, 11):
  for j in range(0, rows[i]):
    n = [(i, j-1), (i, j+1), (i-1, j), (i+1, j)]
    if i < 5:
      n.extend([(i-1,j-1), (i+1,j+1)])
    elif i > 5:
      n.extend([(i-1,j+1),(i+1, j-1)])
    else:
      n.extend([(i-1,j-1),(i+1, j-1)])
    neighbors[i][j] = list(filter(isInside, n))

def search(i,j):
  if i > DEPTH:
    if verifyGrid():
      for g in givens:
        print(g)
      print('----')
      return True
    return False

  if j >= rows[i]:
    if i >= 2 and not verifyRow(i-2):
      return False
    return search(i+1, 0)

  if givens[i][j] > 0:
    return search(i, j+1)

  for t in [1,2,3]:
    givens[i][j] = t
    if countGroup(i,j) <= t:
      search(i, j+1)

  givens[i][j] = 0

  return False

def verifyGrid():
  for i in range(0, 11):
    for j in range(0, rows[i]):
      if countGroup(i,j) != givens[i][j]:
        return False
  return True

def verifyRow(i):
   for j in range(0, rows[i]):
      if countGroup(i,j) != givens[i][j]:
        return False
   return True

def countGroup(i,j):
  x = givens[i][j]
  if x == 0:
    return -1
  search = [(i,j)]
  group = [(i,j)]
  while len(search) > 0:
    (i,j) = search.pop()
    for n in neighbors[i][j]:
      (ni, nj) = n
      if givens[ni][nj] == x and n not in group:
        group.append(n)
        search.append(n)
  return len(group)


givens[0][1] = 2
givens[2][3] = 3
givens[2][5] = 1
givens[4][3] = 1
givens[4][6] = 2
givens[5][2] = 3
givens[6][7] = 1
givens[6][9] = 3
givens[7][2] = 2
givens[7][4] = 3
givens[8][5] = 2
givens[9][0] = 1

start = time.time()
search(0,0)
total = time.time() - start
print(DEPTH, ':', total, ' seconds')
