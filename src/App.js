import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [students, setStudents] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchTag, setSearchTag] = useState('')
  const [isScrolling, setIsScrolling] = useState(false)
  const [tag, setTag] = useState([])
  const allNames = []
  
  // Get students' data when refreshing
 
  useEffect(() => {
    getData();
  }, []);

  // Fetch and get students' data

  const StudentComponent = ({student, studentGrades, gradeValue, counter, studentTags}) => {
    return (
    <div key={student.id} className='student'>
    <img src={student.pic} alt={student.firstName}/>
    <div className='student-info'>
      <h1>{student.firstName.toUpperCase() + ' ' + student.lastName.toUpperCase()}</h1>
      <ul>
        <li>Email: {student.email}</li>
        <li>Comliany: {student.company}</li>
        <li>Skill: {student.skill}</li>
        <li>Average: {gradeValue / studentGrades.length}%</li>
        
      </ul>
      <ul className='student-grades'> {/* Student Grades List */}
        {
          studentGrades.map((grade) => {
            counter += 1
            return (
            <li key={grade} className='list-grades'>
              <p key={grade}>{'Test '+ (counter)}</p>
              <p className='test-grades' key={grade}>%{grade}</p>
            </li>
            )
          })
        }
      </ul>
      <div>
        <div className='tags-container'> {/* Tags List */}
          {
            studentTags.map(element => <p key={element} className={'tag'}>{element}</p>)
          }
        </div>
        <input type={'text'} className={'tag-input'} placeholder={'Add a tag'} onKeyDown={(e) => {handleSubmit(e, student)}}/>
      </div>
    </div>
    <button onClick={(e) => {handleButton(e)}}>+</button>
  </div>
    )
  }

  // Fetch and get students' data

  const getData = async () => {
    try {
      const response = await fetch('https://api.hatchways.io/assessment/students');
      const data = await response.json();
      data.students.forEach(student => student.tags = [])
      setStudents(data.students)
    } catch (error) {
      console.error(error);
    }
  }

  // + && - button

  const handleButton = (e) => {
    if (e.target.parentElement.className === 'student') {
      e.target.parentElement.className += '-open';
      e.target.innerText = '-';
      return;

    } else {
      e.target.parentElement.className = 'student';
      e.target.innerText = '+';
    }
  }

  // Create Tags when pressing Enter

  const handleSubmit = (e, sTags) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      console.log(sTags.tags)
      sTags.tags.push(e.target.value)
      setTag([...sTags.tags])
      e.target.value = '';
    } 
  }

  return (
    <div className="App">

      <div className='wrapper'>
        <div className='inputs-container'>
          <input type={'text'} className={'search'} placeholder={'Search by name'} onChange={(e) => {setSearchName(e.target.value)}}/>
          <input type={'text'} className={'search'} placeholder={'Search by tag'} onChange={(e) => {setSearchTag(e.target.value)}}
          />
        </div>
        <div className={isScrolling ? 'students-scrolling' : 'students'} onScroll={() => {setIsScrolling(true)}}> {/* Display Overflow after scrolling */}
        {
          students ? students.map((student) => {

            // For each student:

            let gradeValue = 0;
            let studentGrades = student.grades;
            let counter = 0;

            studentGrades.forEach((grade) => { // Get grade % average
              gradeValue += parseInt(grade);
            })

            let studentTags = student.tags;

            // Full Name
            allNames.push(student.firstName);
            allNames.push(student.lastName);

            if (!searchName && !searchTag) {

              return (
              <StudentComponent student={student} studentGrades={studentGrades} gradeValue={gradeValue} counter={counter} studentTags={studentTags}/>
            )}
            else if (
              searchTag !== '' &&
              studentTags.some((e) => {
                return e.includes(searchTag)
              }) 
              ) {
              return (
                <StudentComponent student={student} studentGrades={studentGrades} gradeValue={gradeValue} counter={counter} studentTags={studentTags}/>
            )}

            else if (
              searchName !== '' && 
              allNames.some((e) => {
                return e.toLowerCase().includes(searchName.toLowerCase())
              }) 
            ) { 

              return (
                <StudentComponent student={student} studentGrades={studentGrades} gradeValue={gradeValue} counter={counter} studentTags={studentTags}/>
            )}
              return null // Avoid Eslint "expected value from arrow function"
            }

          ) : ""
        }
        </div>
      </div>
    </div>
  );
}

export default App;
