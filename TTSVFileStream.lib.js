//ver alt0_3WAlt0test0W

var readline=require('readline');

var fs=require('fs');

var myUtil=require('./myUtil.lib.js');

var SETTINGS=require('./TTSVFileStream.cfg.js');

module.exports=function(
	params/*={
		fileNames: [/ * ... * /]
	}*/
)
{
	var vm=this;
	
	vm.fileNames=params.fileNames;
	
	vm.currFileNameIdx=0;
	
	vm.accum='';
	
	vm.fd=null;
	
	vm.buffer=Buffer.allocUnsafe(SETTINGS.fileReadBuffer.size);
	
	vm.cleanup=function()/*ver alt0_0WAlt0test0W .*/
	{
		if(myUtil.isDefined(vm.fd))
		{
			fs.closeSync(vm.fd);
			vm.fd=null;
		}
		vm.buffer=null;
	};
	
	vm.parseLine=function(line)/*ver alt0_0WAlt0test0W .*/
	{
		if(myUtil.isDefined(line) && !!line)
		{
			return line.split('\t');
		}
		return null;
	};
	
	vm.reinitFd=function()/*ver alt0_0WAlt0test0W .*/
	{
		if(myUtil.isDefined(vm.fd))
		{
			fs.closeSync(vm.fd);
			vm.fd=null;
		}
		if(vm.currFileNameIdx<vm.fileNames.length)
		{
			vm.fd=fs.openSync(vm.fileNames[vm.currFileNameIdx++],'r');
			return true;
		}
		return false;
	};
	
	vm.getChunk=function()/*ver alt0_1WAlt0test0W .*/
	{
		/*< ...(1)>*/
		var bytesRead=(
			myUtil.isDefined(vm.fd)?
				fs.readSync(
					vm.fd, 
					vm.buffer,
					0,
					vm.buffer.length,
					null
				)
			:
				0
		);
		/*</...(1)>*/
		if(bytesRead==0)
		{
			return vm.reinitFd()?vm.getChunk():null;
		}
		return vm.buffer.slice(0, bytesRead).toString();
	};
	
	vm.getLine=function()/*ver alt0_1WAlt0test0W .*/
	{
		var newLineIdx=-1;
		while((newLineIdx=vm.accum.indexOf('\n'))===-1)
		{
			var chunk=vm.getChunk();
			if(!chunk)
			{
				return vm.parseLine(vm.accum);
			}
			vm.accum+=chunk;
		}
		var line=vm.accum.slice(0,newLineIdx);
		vm.accum=vm.accum.slice(newLineIdx+1);
		return vm.parseLine(line);
	};
	
	vm.reinitFd();
};

















