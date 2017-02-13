function windows (selector, debug)
{
    /*
    var taskbar = document.createElement('div');
    taskbar.id = 'windows_taskbar';
    document.body.appendChild(taskbar);
    */

    var positions = JSON.parse(localStorage.windows || "{}");
    var windows = document.querySelectorAll(selector);
    var index = 0;
    //find all elements with specified selector
    [].forEach.call(windows,function(win)
    {
        if (win.id && positions[win.id])
        {
            try
            {
                if (positions[win.id].top.trim()!='' && positions[win.id].left.trim()!='')
                {
                    win.style.top = positions[win.id].top;
                    win.style.left = positions[win.id].left;
                    console.log (win.id+': restoring to '+win.style.top+','+win.style.left);
                }
                else
                {
                    console.log (win.id+': can not extract position');
                }
            }
            catch (e)
            {
                if (win.getAttribute('position'))
                {
                    win.style.top = win.getAttribute('position').substring(0,win.getAttribute('position').indexOf(';'));
                    win.style.left = win.getAttribute('position').substring(win.getAttribute('position').indexOf(';')+1);
                    if (debug) console.log (win.style.zIndex+':'+win.id+' ['+win.style.top+','+win.style.left+']');
                }
            }
        }
        else if (win.id)
        {
            if (win.getAttribute('position'))
            {
                win.style.top = win.getAttribute('position').substring(0,win.getAttribute('position').indexOf(';'));
                win.style.left = win.getAttribute('position').substring(win.getAttribute('position').indexOf(';')+1);
                console.log (win.id+': defaults '+win.style.zIndex+':'+ '['+win.style.top+','+win.style.left+']');
            }
        }
        if (win.id && positions[win.id])
        {
            if (positions[win.id].index)
            {
                win.style.zIndex = positions[win.id].index;                
            }
            if (positions[win.id].hidden)
            {
                win.classList.toggle('collapse');
            }
        }
        // …find the title bar inside it and do something onmousedown
        var close = win.querySelector('.close');
        if (close)
        {
            close.addEventListener('click',function(evt)
            {
                win.classList.toggle('collapse');
                if (positions[win.id]==null)
                {
                    positions[win.id] = {};
                }
                if (win.classList.contains('collapse'))
                {
                    positions[win.id].hidden = true;
                }
                else
                {
                    positions[win.id].hidden = false;
                }
                index = windowsIndex();
                if (win.style.zIndex=="" || index>parseInt(win.style.zIndex))
                {
                    win.style.zIndex = index+1;
                    if (positions[win.id]==null)
                    {
                        positions[win.id] = {};
                    }
                    positions[win.id].index = win.style.zIndex;
                }
                else
                {
                    //console.log (win.id+":close "+index+" vs "+parseInt(win.style.zIndex)+ "("+win.style.zIndex+")");
                }
                localStorage.windows = JSON.stringify(positions);            
            });
        }
        var content = win.querySelector('.content');
        if (content)
        {
            content.addEventListener('click',function(evt)
            {
                index = windowsIndex();
                if (win.style.zIndex=="" || index>parseInt(win.style.zIndex))
                {
                    win.style.zIndex = index+1;
                    if (positions[win.id]==null)
                    {
                        positions[win.id] = {};
                    }
                    positions[win.id].index = win.style.zIndex;
                }
                else
                {
                    //console.log (win.id+":content "+index+" vs "+parseInt(win.style.zIndex)+"("+win.style.zIndex+")");
                }                    
                localStorage.windows = JSON.stringify(positions);                
            });
        }
        var title = win.querySelector('.title');
        if (title)
        {
            title.addEventListener('mousedown',function(evt)
            {
                index = windowsIndex();
                if (win.style.zIndex=="" || index>parseInt(win.style.zIndex))
                {
                    win.style.zIndex = index+1;
                }
                // Record where the window started
                var real = window.getComputedStyle(win),
                winX = parseFloat(real.left),
                winY = parseFloat(real.top);

                // Record where the mouse started
                var mX = evt.clientX,
                mY = evt.clientY;

                // When moving anywhere on the page, drag the window
                // …until the mouse button comes up
                document.body.addEventListener('mousemove',drag,false);
                document.body.addEventListener('mouseup',up,false);

                // Every time the mouse moves, we do the following 
                function drag(evt)
                {
                    // Add difference between where the mouse is now
                    // versus where it was last to the original positions
                    win.style.top  = winY + evt.clientY-mY + 'px';
                    win.style.left = winX + evt.clientX-mX + 'px';
                    if (debug)
                    {
                        if (win.getAttribute('title')==null)
                        {
                            win.setAttribute('title',title.innerHTML);
                        }
                        title.innerHTML = win.style.zIndex+':'+win.id+' ['+parseInt(win.style.top)+','+parseInt(win.style.left)+']';
                    }
                };
                function up(evt)
                {
                    document.body.removeEventListener('mousemove',drag,false);
                    document.body.removeEventListener('mouseup',up,false);
                    //positions[win.id] = {top:win.style.top, left:win.style.left, index:win.style.zIndex};

                    if (positions[win.id]==null)
                    {
                        positions[win.id] = {};
                    }
                    positions[win.id].top = win.style.top;
                    positions[win.id].left = win.style.left;
                    positions[win.id].index = win.style.zIndex;
                    //console.log (positions[win.id]);
                    localStorage.windows = JSON.stringify(positions);

                }
            },false);
        }
        else
        {
            console.log ('window '+win.id+' does not have title bar');
        }
    });
    
}

function windowsIndex()
{
    var divs = document.getElementsByClassName('window');
    //console.log ("found "+divs.length+" windows");
    var highest = 0;
    for (var i = 0; i < divs .length; i++)
    {
        var zindex = parseInt(divs[i].style.zIndex);
        if (zindex > highest) 
        {
            highest = zindex;
        }
    }
    return highest;
}